import { GameObject, Vector, world } from "@tabletop-playground/api";
import { Atop, NSID } from "ttpg-darrell";
import {
  __atopCacheGet,
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib";
import { UnitModifierSchemaType } from "../../../schema";
import { CombatAttrs } from "../../../unit-attrs";

export const CARD_NSID_ASSAIL: string =
  "card.firmament-plot:thunders-edge/assail";

export function isPuppeted(
  plotCardNsid: string,
  opponentPlayerSlot: number
): boolean {
  let card: GameObject | undefined;
  const controlTokens: Array<GameObject> = [];
  const skipContained: boolean = true;
  for (const obj of world.getAllObjects(skipContained)) {
    const nsid: string = NSID.get(obj);
    if (nsid === plotCardNsid) {
      card = obj;
    } else if (
      nsid.startsWith("token.control:") &&
      obj.getOwningPlayerSlot() === opponentPlayerSlot
    ) {
      controlTokens.push(obj);
    }
  }

  // Is puppeted if any control token matches the opponent's puppeted faction.
  if (card) {
    const atop: Atop = __atopCacheGet(card);
    for (const controlToken of controlTokens) {
      const pos: Vector = controlToken.getPosition();
      if (atop.isAtop(pos)) {
        return true;
      }
    }
  }

  return false;
}

export const Assail: UnitModifierSchemaType = {
  name: "Assail",
  description: "+1 to combat rolls against puppeted",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "firmament-plot", nsidName: "assail" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
      (rollType === "spaceCombat" || rollType === "groundCombat") &&
      isPuppeted(CARD_NSID_ASSAIL, combatRoll.opponent.playerSlot)
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
      if (spaceCombat) {
        spaceCombat.addHit(1);
      }

      const groundCombat: CombatAttrs | undefined = unitAttrs.getGroundCombat();
      if (groundCombat) {
        groundCombat.addHit(1);
      }
    }
  },
};

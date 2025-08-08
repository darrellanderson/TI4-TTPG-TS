import { Vector, world } from "@tabletop-playground/api";
import { Find, NSID } from "ttpg-darrell";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";

function _countPromissoryNotes(playerSlot: number): number {
  let count: number = 0;
  const find: Find = new Find();
  const skipContained: boolean = true;
  for (const obj of world.getAllObjects(skipContained)) {
    const nsid: string = NSID.get(obj);
    if (nsid.startsWith("card.promissory:")) {
      const pos: Vector = obj.getPosition();
      const owner: number = find.closestOwnedCardHolderOwner(pos);
      if (owner === playerSlot) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Apply a combat bonus per promissory note in the opponent's player area.
 */
export const PromissoryTarget: UnitModifierSchemaType = {
  name: "Promissory Target",
  description: "Opponent's promissory notes add a bonus",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "event", nsidName: "promissory-target" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return (
      (combatRoll.getRollType() === "spaceCombat" ||
        combatRoll.getRollType() === "groundCombat") &&
      _countPromissoryNotes(combatRoll.opponent.playerSlot) > 0
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

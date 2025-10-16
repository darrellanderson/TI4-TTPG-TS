import { CardHolder, Vector, world } from "@tabletop-playground/api";
import { CardUtil, Find, NSID } from "ttpg-darrell";
import { CombatRoll } from "../../../../combat-lib";
import { UnitModifierSchemaType } from "../../../schema";
import { CombatAttrs } from "../../../unit-attrs";

export function _countSupports(playerSlot: number): number {
  let count: number = 0;
  const cardUtil: CardUtil = new CardUtil();
  const find: Find = new Find();
  const skipContained: boolean = true;
  for (const obj of world.getAllObjects(skipContained)) {
    const nsid: string = NSID.get(obj);

    // Cards in player area.
    if (
      nsid.startsWith("card.promissory") &&
      nsid.endsWith("/support-for-the-throne") &&
      cardUtil.isLooseCard(obj)
    ) {
      const pos: Vector = obj.getPosition();
      const owner: number = find.closestOwnedCardHolderOwner(pos);
      if (owner === playerSlot) {
        count++;
      }
    }

    // Cards in scoring hands.
    if (
      nsid === "card-holder:base/player-scoring" &&
      obj instanceof CardHolder &&
      obj.getOwningPlayerSlot() === playerSlot
    ) {
      for (const card of obj.getCards()) {
        const cardNsid: string = NSID.get(card);
        if (
          cardNsid.startsWith("card.promissory") &&
          cardNsid.endsWith("/support-for-the-throne")
        ) {
          count++;
        }
      }
    }
  }
  return count;
}

/**
 * Apply a combat bonus per support in the opponent's player area.
 */
export const Imperator: UnitModifierSchemaType = {
  name: "Imperator",
  description: "+1 combat for each support in the opponent's area",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "breakthrough", nsidName: "imperator" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return (
      (combatRoll.getRollType() === "spaceCombat" ||
        combatRoll.getRollType() === "groundCombat") &&
      _countSupports(combatRoll.opponent.playerSlot) > 0
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    const count: number = _countSupports(combatRoll.opponent.playerSlot);
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
      if (spaceCombat) {
        spaceCombat.addHit(count);
      }
      const groundCombat: CombatAttrs | undefined = unitAttrs.getGroundCombat();
      if (groundCombat) {
        groundCombat.addHit(count);
      }
    }
  },
};

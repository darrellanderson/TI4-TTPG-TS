import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const TheAlastor: UnitModifierSchemaType = {
  name: "The Alastor",
  description: "Ground forces may participate in space combat",
  owner: "self",
  priority: "mutate",
  triggers: [{ cardClass: "unit", nsidName: "the-alastor" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "spaceCombat" && combatRoll.self.hasUnit("flagship");
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const groundCombat: CombatAttrs | undefined = unitAttrs.getGroundCombat();
      if (unitAttrs.isGround() && groundCombat) {
        unitAttrs.setSpaceCombat(
          new CombatAttrs({
            dice: groundCombat.getDice(),
            hit: groundCombat.getHit(),
          }),
        );
      }
    }
  },
};

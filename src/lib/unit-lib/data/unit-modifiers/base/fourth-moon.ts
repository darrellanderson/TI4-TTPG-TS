import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const FourthMoon: UnitModifierSchemaType = {
  name: "Fourth Moon",
  description: "Opponent's ships cannot use SUSTAIN DAMAGE",
  owner: "opponent",
  priority: "adjust",
  triggers: [{ cardClass: "flagship", nsidName: "fourth-moon" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.opponent.hasUnit("flagship");
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.opponent.unitAttrsSet.getAll()) {
      if (unitAttrs.hasSustainDamage()) {
        unitAttrs.setDisableSustainDamage(true);
      }
    }
  },
};

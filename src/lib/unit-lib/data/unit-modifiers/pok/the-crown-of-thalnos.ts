import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const X: UnitModifierSchemaType = {
  name: "",
  description:
    "Apply +1 to COMBAT rolls, reroll misses but must destroy any units that do not produce at least one hit",
  owner: "",
  priority: "",
  triggers: [],
  applies: (combatRoll: CombatRoll): boolean => {
    return false;
  },
  apply: (combatRoll: CombatRoll): void => {},
};

import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const X: UnitModifierSchemaType = {
  name: "",
  description: "SPACE CANNON 5(x3)",
  owner: "",
  priority: "",
  triggers: [],
  applies: (combatRoll: CombatRoll): boolean => {
    return false;
  },
  apply: (combatRoll: CombatRoll): void => {},
};

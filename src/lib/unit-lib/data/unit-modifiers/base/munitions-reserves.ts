import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const X: UnitModifierSchemaType = {
  name: "",
  description: "Spend 2 TGs to reroll space combat misses",
  owner: "",
  priority: "",
  triggers: [],
  isActiveIdle: true,
  applies: (combatRoll: CombatRoll): boolean => {
    return false;
  },
  apply: (combatRoll: CombatRoll): void => {},
};

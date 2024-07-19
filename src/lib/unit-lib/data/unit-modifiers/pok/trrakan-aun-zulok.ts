import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const X: UnitModifierSchemaType = {
  name: "",
  description:
    "+1 die to a unit ability (anti-fighter barrage, bombardment, space cannon)",
  owner: "",
  priority: "",
  triggers: [],
  applies: (combatRoll: CombatRoll): boolean => {
    return false;
  },
  apply: (combatRoll: CombatRoll): void => {},
};

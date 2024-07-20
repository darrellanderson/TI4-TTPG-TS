import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const Eidolon: UnitModifierSchemaType = {
  name: "",
  description: "Count as ship when off planet",
  owner: "",
  priority: "",
  triggers: [{ cardClass: "mech", nsidName: "eidolon" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return false;
  },
  apply: (combatRoll: CombatRoll): void => {},
};

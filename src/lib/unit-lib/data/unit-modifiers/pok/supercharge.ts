import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const Supercharge: UnitModifierSchemaType = {
  name: "Supercharge",
  description: "+1 to all COMBAT rolls",
  owner: "self",
  priority: "adjust",
  isActiveIdle: true,
  triggers: [{ cardClass: "technology", nsidName: "supercharge" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "spaceCombat" || rollType === "groundCombat";
  },
  apply: (combatRoll: CombatRoll): void => {},
};

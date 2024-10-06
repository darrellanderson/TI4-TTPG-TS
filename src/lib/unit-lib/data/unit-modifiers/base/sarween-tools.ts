import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const SarweenTools: UnitModifierSchemaType = {
  name: "Sarween Tools",
  description: "-1 to production cost",
  triggers: [
    {
      cardClass: "technology.yellow",
      nsidName: "sarween-tools",
    },
  ],
  owner: "self",
  priority: "adjust",
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "production";
  },
  apply: (_combatRoll: CombatRoll): void => {},
};

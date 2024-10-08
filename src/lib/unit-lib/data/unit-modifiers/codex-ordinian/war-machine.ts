import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const WarMachine: UnitModifierSchemaType = {
  name: "War Machine",
  description: "+4 production, -1 to production cost",
  triggers: [
    {
      cardClass: "action",
      nsidName: "war-machine",
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

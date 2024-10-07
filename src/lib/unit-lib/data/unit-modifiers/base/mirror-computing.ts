import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const MirrorComputing: UnitModifierSchemaType = {
  name: "Mirror Computing",
  description: "Tradegoods count double",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "technology.yellow", nsidName: "mirror-computing" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "production";
  },
  apply: (_combatRoll: CombatRoll): void => {},
};

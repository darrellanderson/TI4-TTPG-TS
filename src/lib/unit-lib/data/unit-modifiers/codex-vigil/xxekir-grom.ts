import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const XxekirGrom: UnitModifierSchemaType = {
  name: "Xxekir Grom",
  description: "Combine planet resources and influence",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "hero", nsidName: "xxekir-grom" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "production";
  },
  apply: (_combatRoll: CombatRoll): void => {},
};

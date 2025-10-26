import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const ArchonsGift: UnitModifierSchemaType = {
  name: "Archon's Gift",
  description: "Can spend influence as resources",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "breakthrough", nsidName: "archons-gift" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "production";
  },
  apply: (_combatRoll: CombatRoll): void => {},
};

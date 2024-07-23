import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const EmissaryTaivra: UnitModifierSchemaType = {
  name: "Emissary Taivra",
  description: "Active wormhole system is adjacent to all other wormholes",
  owner: "self",
  priority: "adjust",
  isActiveIdle: true,
  triggers: [{ cardClass: "agent", nsidName: "emissary-taivra" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "spaceCannonOffense";
  },
  apply: (_combatRoll: CombatRoll): void => {
    // nop: adjaceny lib handles this
  },
};

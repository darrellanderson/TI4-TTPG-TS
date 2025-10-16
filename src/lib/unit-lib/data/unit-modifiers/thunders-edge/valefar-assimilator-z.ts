import { CombatRoll } from "../../../../combat-lib";
import { UnitModifierSchemaType } from "../../../schema";

export const ValefarAssimilatorZ: UnitModifierSchemaType = {
  name: "Valefar Assimilator Z",
  description: "Flagship gains text abilities of Z factions",
  owner: "self",
  priority: "mutate",
  triggers: [{ cardClass: "breakthrough", nsidName: "valefar-assimilator-z" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.self.hasUnit("flagship");
  },
  apply: (_combatRoll: CombatRoll): void => {
    // NOP: add at a higher level
  },
};

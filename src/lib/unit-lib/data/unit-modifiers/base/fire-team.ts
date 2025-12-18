import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const FireTeam: UnitModifierSchemaType = {
  name: "Fire Team",
  description: "Reroll GROUND COMBAT misses",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "action", nsidName: "fire-team" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "groundCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const groundCombat: CombatAttrs | undefined = unitAttrs.getGroundCombat();
      if (groundCombat) {
        groundCombat.setRerollMisses(true);
      }
    }
  },
};

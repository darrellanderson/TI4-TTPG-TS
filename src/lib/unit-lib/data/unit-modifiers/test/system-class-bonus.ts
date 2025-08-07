import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { System } from "../../../../system-lib/system/system";

/**
 * Test modifier for an anomaly (asteroid field) that suppresses an ability (space cannon).
 */
export const SystemClassBonus: UnitModifierSchemaType = {
  name: "System Class Bonus",
  description: "System class adds a bonus to the combat roll",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "event", nsidName: "system-class-bonus" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const system: System | undefined = combatRoll.system;
    return system !== undefined && system.getClass() === "off-map";
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
      if (spaceCombat) {
        spaceCombat.addHit(1);
      }
    }
  },
};

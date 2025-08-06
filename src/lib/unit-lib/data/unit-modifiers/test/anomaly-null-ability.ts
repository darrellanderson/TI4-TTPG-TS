import { System } from "lib/system-lib/system/system";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export function _hasNullAbilityAnomaly(system: System | undefined): boolean {
  if (!system) {
    return false;
  }
  const anomalies: Array<string> = system.getAnomalies();
  return anomalies.includes("asteroid-field");
}

export function _countAdjacentPdsInAnomaly(combatRoll: CombatRoll): number {
  let count = 0;
  combatRoll.self.unitPlasticAdj.forEach((unitPlastic): void => {
    const system: System | undefined = unitPlastic.getSystem();
    if (_hasNullAbilityAnomaly(system)) {
      count += unitPlastic.getCount();
    }
  });
  return count;
}

/**
 * Test modifier for an anomaly (asteroid field) that suppresses an ability (space cannon).
 */
export const AnomalyNullAbility: UnitModifierSchemaType = {
  name: "Anomaly Null Ability",
  description: "Anomaly suppresses an ability",
  owner: "self",
  priority: "mutate",
  triggers: [{ cardClass: "event", nsidName: "anomaly-null-ability" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return (
      combatRoll.getRollType() === "spaceCannonOffense" &&
      (_hasNullAbilityAnomaly(combatRoll.system) ||
        _countAdjacentPdsInAnomaly(combatRoll) > 0)
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    // Suppress adjacent.
    const pdsAdj: number = combatRoll.self.getCountAdj("pds");
    const suppressAdj: number = _countAdjacentPdsInAnomaly(combatRoll);
    combatRoll.self.overrideUnitCountAdj.set("pds", pdsAdj - suppressAdj);

    // Suppress ability for units in active system.
    if (_hasNullAbilityAnomaly(combatRoll.system)) {
      for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
        unitAttrs.setSpaceCannon(undefined);
      }
    }
  },
};

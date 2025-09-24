import { System } from "../../../../system-lib/system/system";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export function _isEntropicScar(system: System | undefined): boolean {
  if (!system) {
    return false;
  }
  const anomalies: Array<string> = system.getAnomalies();
  return anomalies.includes("scar");
}

export function _countAdjacentPdsInEntropicScar(
  combatRoll: CombatRoll
): number {
  let count = 0;
  combatRoll.self.unitPlasticAdj.forEach((unitPlastic): void => {
    const system: System | undefined = unitPlastic.getSystem();
    if (_isEntropicScar(system)) {
      count += unitPlastic.getCount();
    }
  });
  return count;
}

/**
 * Test modifier for an anomaly (asteroid field) that suppresses an ability (space cannon).
 */
export const EntropicScar: UnitModifierSchemaType = {
  name: "Entropic Scar",
  description: "Unit abilities cannot be used against units in a scar",
  owner: "self",
  priority: "mutate",
  triggerAlways: true,
  triggers: [],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: string = combatRoll.getRollType();
    if (rollType === "spaceCannonOffense") {
      return (
        _isEntropicScar(combatRoll.system) ||
        _countAdjacentPdsInEntropicScar(combatRoll) > 0
      );
    }
    if (_isEntropicScar(combatRoll.system)) {
      return (
        rollType === "antiFighterBarrage" ||
        rollType === "bombardment" ||
        rollType === "spaceCannonDefense"
      );
    }
    return false;
  },
  apply: (combatRoll: CombatRoll): void => {
    // Suppress adjacent.
    const pdsAdj: number = combatRoll.self.getCountAdj("pds");
    const suppressAdj: number = _countAdjacentPdsInEntropicScar(combatRoll);
    combatRoll.self.overrideUnitCountAdj.set("pds", pdsAdj - suppressAdj);

    // Suppress ability for units in active system.
    if (_isEntropicScar(combatRoll.system)) {
      for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
        unitAttrs.setSpaceCannon(undefined);
      }
    }
  },
};

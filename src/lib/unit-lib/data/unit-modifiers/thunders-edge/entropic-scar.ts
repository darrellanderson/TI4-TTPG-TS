import { System } from "../../../../system-lib/system/system";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { CombatAttrs } from "lib/unit-lib/unit-attrs";

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

    // Active system is entropic scar.
    if (_isEntropicScar(combatRoll.system)) {
      return (
        rollType === "spaceCannonOffense" ||
        rollType === "antiFighterBarrage" ||
        rollType === "bombardment" ||
        rollType === "spaceCannonDefense"
      );
    }

    // Adjacent system is entropic scar and space cannon offense with range.
    if (
      rollType === "spaceCannonOffense" &&
      _countAdjacentPdsInEntropicScar(combatRoll) > 0
    ) {
      for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
        const spaceCannon: CombatAttrs | undefined = unitAttrs.getSpaceCannon();
        if (spaceCannon && spaceCannon.getRange() > 0) {
          return true;
        }
      }
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
        unitAttrs.setDisableSpaceCannonOffense(true);
        unitAttrs.setDisableAntiFighterBarrage(true);
        unitAttrs.setDisableBombardment(true);
        unitAttrs.setDisableSpaceCannonDefense(true);
        unitAttrs.setDisablePlanetaryShield(true);
        unitAttrs.setDisableSustainDamage(true);
      }
    }
  },
};

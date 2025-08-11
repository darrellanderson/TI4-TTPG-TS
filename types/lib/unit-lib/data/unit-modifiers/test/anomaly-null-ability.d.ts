import { System } from "lib/system-lib/system/system";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
export declare function _hasNullAbilityAnomaly(system: System | undefined): boolean;
export declare function _countAdjacentPdsInAnomaly(combatRoll: CombatRoll): number;
/**
 * Test modifier for an anomaly (asteroid field) that suppresses an ability (space cannon).
 */
export declare const AnomalyNullAbility: UnitModifierSchemaType;

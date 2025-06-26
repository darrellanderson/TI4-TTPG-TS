import { DiceParams, DiceResult } from "ttpg-darrell";
import { CombatRoll } from "../combat-roll/combat-roll";
import { UnitType } from "../../unit-lib/schema/unit-attrs-schema";
export type UnitRollsSummary = {
    diceParams: DiceParams;
    hits: number;
    diceWithHitsCritsAndRerolls: Array<string>;
};
/**
 * Generate a text summary of a combat roll,
 * including a method to broadcast that summary.
 */
export declare class CombatRollSummary {
    private readonly _combatRoll;
    private readonly _diceResults;
    /**
     * Convert a pile of dice into per-unit summaries.
     *
     * @param diceResults
     * @returns
     */
    static getUnitRollsSummaries(diceResults: Array<DiceResult>): Map<UnitType, UnitRollsSummary>;
    /**
     * Convert per-unit summaries into an overall summary.
     *
     * @param combatRoll
     * @param unitRollsSummaries
     * @returns
     */
    static getSimpleSummary(combatRoll: CombatRoll, unitRollsSummaries: Map<UnitType, UnitRollsSummary>): string;
    /**
     * Summarize only this combat roll result, not reusable for other rolls.
     *
     * @param combatRoll
     * @param diceResults
     */
    constructor(combatRoll: CombatRoll, diceResults: Array<DiceResult>);
    /**
     * Broadcast summary to all players, colored by the rolling player's slot.
     */
    broadcastAll(): void;
}

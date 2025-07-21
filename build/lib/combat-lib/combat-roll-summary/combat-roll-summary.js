"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombatRollSummary = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * Generate a text summary of a combat roll,
 * including a method to broadcast that summary.
 */
class CombatRollSummary {
    /**
     * Convert a pile of dice into per-unit summaries.
     *
     * @param diceResults
     * @returns
     */
    static getUnitRollsSummaries(diceResults) {
        var _a;
        const result = new Map();
        for (const diceResult of diceResults) {
            const unit = diceResult.diceParams.id;
            let unitRollsSummary = result.get(unit);
            if (!unitRollsSummary) {
                unitRollsSummary = {
                    diceParams: diceResult.diceParams,
                    hits: 0,
                    diceWithHitsCritsAndRerolls: [],
                };
                result.set(unit, unitRollsSummary);
            }
            // Add hits and crits.
            if (diceResult.hit) {
                unitRollsSummary.hits += 1;
            }
            if (diceResult.crit) {
                unitRollsSummary.hits += (_a = diceResult.diceParams.critCount) !== null && _a !== void 0 ? _a : 1;
            }
            // Format.
            const formatted = ttpg_darrell_1.DiceGroup.format(diceResult);
            unitRollsSummary.diceWithHitsCritsAndRerolls.push(formatted);
        }
        return result;
    }
    /**
     * Convert per-unit summaries into an overall summary.
     *
     * @param combatRoll
     * @param unitRollsSummaries
     * @returns
     */
    static getSimpleSummary(combatRoll, unitRollsSummaries) {
        const unitToCombatAttrs = combatRoll._getUnitToCombatAttrs();
        let totalHits = 0;
        const unitResults = [];
        for (const [unit, unitRollsSummary] of unitRollsSummaries.entries()) {
            const unitAttrs = combatRoll.self.unitAttrsSet.get(unit);
            const hitValue = unitRollsSummary.diceParams.hit;
            if (unitAttrs && hitValue !== undefined) {
                const unitName = unitAttrs.getName();
                totalHits += unitRollsSummary.hits;
                let critValue = "";
                if (unitRollsSummary.diceParams.crit) {
                    critValue = `|${unitRollsSummary.diceParams.crit}`;
                }
                let dice = "";
                const combatAttrs = unitToCombatAttrs.get(unit);
                if (combatAttrs) {
                    const diceCount = combatAttrs.getDice();
                    if (diceCount > 1) {
                        dice = `x${diceCount}`;
                    }
                }
                const formatted = `${unitName} (${hitValue}${critValue}${dice}): ${unitRollsSummary.diceWithHitsCritsAndRerolls}`;
                unitResults.push(formatted);
            }
        }
        const playerName = TI4.playerName.getBySlot(combatRoll.self.playerSlot);
        const combinedUnitResults = unitResults.join(", ");
        const modifiers = combatRoll.getUnitModifierNamesWithDescriptions();
        if (modifiers.length === 0) {
            modifiers.push("no modifiers");
        }
        return `${playerName} rolled ${totalHits} hits: ${combinedUnitResults}\nModifiers: ${modifiers.join(", ")}`;
    }
    /**
     * Summarize only this combat roll result, not reusable for other rolls.
     *
     * @param combatRoll
     * @param diceResults
     */
    constructor(combatRoll, diceResults) {
        this._combatRoll = combatRoll;
        this._diceResults = diceResults;
    }
    /**
     * Broadcast summary to all players, colored by the rolling player's slot.
     */
    broadcastAll() {
        const unitRollsSummaries = CombatRollSummary.getUnitRollsSummaries(this._diceResults);
        const simpleSummary = CombatRollSummary.getSimpleSummary(this._combatRoll, unitRollsSummaries);
        const rollingPlayerSlot = this._combatRoll.self.playerSlot;
        let color = api_1.world.getSlotColor(rollingPlayerSlot);
        if (rollingPlayerSlot === 19 || !color) {
            color = TI4.playerColor.getAnonymousColor();
        }
        ttpg_darrell_1.Broadcast.broadcastAll(simpleSummary, color);
    }
}
exports.CombatRollSummary = CombatRollSummary;
//# sourceMappingURL=combat-roll-summary.js.map
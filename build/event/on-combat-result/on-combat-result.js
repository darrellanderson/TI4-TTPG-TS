"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnCombatResult = void 0;
const combat_roll_summary_1 = require("../../lib/combat-lib/combat-roll-summary/combat-roll-summary");
/**
 * Report combat roll results.
 */
class OnCombatResult {
    constructor() {
        this._onCombatResultHandler = (combatRoll, diceResults) => {
            const combatRollSummary = new combat_roll_summary_1.CombatRollSummary(combatRoll, diceResults);
            combatRollSummary.broadcastAll();
        };
    }
    init() {
        TI4.events.onCombatResult.add(this._onCombatResultHandler);
    }
    destroy() {
        TI4.events.onCombatResult.remove(this._onCombatResultHandler);
    }
}
exports.OnCombatResult = OnCombatResult;
//# sourceMappingURL=on-combat-result.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnTurnStateChanged = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * Clear passed state when all players have passed.
 */
class OnTurnStateChanged {
    constructor() {
        this._onTurnStateChanged = (turnOrder) => {
            // If all players have passed, reset passed and inform.
            const playerSlots = turnOrder.getTurnOrder();
            const activeIndex = playerSlots.findIndex((playerSlot) => turnOrder.getPassed(playerSlot) === false);
            if (activeIndex === -1 && playerSlots.length > 0) {
                playerSlots.forEach((playerSlot) => {
                    turnOrder.setPassed(playerSlot, false);
                });
                const msg = "All players have passed";
                ttpg_darrell_1.Broadcast.broadcastAll(msg);
                TI4.events.onAllPlayersPassed.trigger();
            }
            // If the active player passes, end turn.
            const currentPlayer = turnOrder.getCurrentTurn();
            const isCurrentPlayerPassed = turnOrder.getPassed(currentPlayer);
            if (isCurrentPlayerPassed) {
                turnOrder.nextTurn();
            }
        };
    }
    init() {
        ttpg_darrell_1.TurnOrder.onTurnStateChanged.add(this._onTurnStateChanged);
    }
    destroy() {
        ttpg_darrell_1.TurnOrder.onTurnStateChanged.remove(this._onTurnStateChanged);
    }
}
exports.OnTurnStateChanged = OnTurnStateChanged;
//# sourceMappingURL=on-turn-state-changed.js.map
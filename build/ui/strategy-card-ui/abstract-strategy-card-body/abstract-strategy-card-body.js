"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractStrategyCardBody = void 0;
/**
 * Manage the contents of a strategy card UI (betweent the title and the
 * play/pass buttons).
 *
 * Body can be empty.  Also provides optional additional report text.
 *
 * Use getState/setState to preserve any data needed to regenerate the body.
 */
class AbstractStrategyCardBody {
    constructor(strategyCardsState, strategyCardNumber, playerSlot) {
        this._strategyCardsState = strategyCardsState;
        this._strategyCardNumber = strategyCardNumber;
        this._playerSlot = playerSlot;
    }
    getState() {
        const numbersAndStates = this._strategyCardsState.active(this._playerSlot);
        for (const numberAndState of numbersAndStates) {
            if (numberAndState.number === this._strategyCardNumber) {
                return numberAndState.state;
            }
        }
        return undefined;
    }
    setState(state) {
        this._strategyCardsState.addOrUpdate(this._playerSlot, this._strategyCardNumber, state);
    }
    isPlayingPlayer() {
        const lastPlayerSlotPlayed = this._strategyCardsState.getLastPlayerSlotPlayed(this._strategyCardNumber);
        return lastPlayerSlotPlayed === this._playerSlot;
    }
    getPlayerSlot() {
        return this._playerSlot;
    }
    getStrategyCardNumber() {
        return this._strategyCardNumber;
    }
}
exports.AbstractStrategyCardBody = AbstractStrategyCardBody;
//# sourceMappingURL=abstract-strategy-card-body.js.map
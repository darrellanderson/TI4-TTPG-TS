"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvanceNoWhensAfters = void 0;
const agenda_turn_order_1 = require("../agenda-turn-order/agenda-turn-order");
/**
 * Advance turn and/or phase when the current player has no whens or afters
 * during the appropriate phase.
 */
class AdvanceNoWhensAfters {
    constructor(agendaState) {
        this._onAgendaStateChangedHandler = () => {
            this.maybeAdvance();
        };
        this._agendaState = agendaState;
        this._agendaState.onAgendaStateChanged.add(this._onAgendaStateChangedHandler);
        this.maybeAdvance();
    }
    _isLastPlayerInTurnOrder() {
        const turnOrder = TI4.turnOrder.getTurnOrder();
        const currentTurn = TI4.turnOrder.getCurrentTurn();
        return currentTurn === turnOrder[turnOrder.length - 1];
    }
    _isWhenPlayed() {
        const playerCount = TI4.config.playerCount;
        for (let seatIndex = 0; seatIndex < playerCount; seatIndex++) {
            if (this._agendaState.getSeatNoWhens(seatIndex) === "unknown") {
                return true;
            }
        }
        return false;
    }
    _isAfterPlayed() {
        const playerCount = TI4.config.playerCount;
        for (let seatIndex = 0; seatIndex < playerCount; seatIndex++) {
            if (this._agendaState.getSeatNoAfters(seatIndex) === "unknown") {
                return true;
            }
        }
        return false;
    }
    _isSkipTurnWhen() {
        const current = TI4.turnOrder.getCurrentTurn();
        const seatIndex = TI4.playerSeats.getSeatIndexByPlayerSlot(current);
        const unknownNoNeverPlay = this._agendaState.getSeatNoWhens(seatIndex);
        return (unknownNoNeverPlay === "no" ||
            unknownNoNeverPlay === "never" ||
            unknownNoNeverPlay === "play");
    }
    _isSkipTurnAfter() {
        const current = TI4.turnOrder.getCurrentTurn();
        const seatIndex = TI4.playerSeats.getSeatIndexByPlayerSlot(current);
        const unknownNoNeverPlay = this._agendaState.getSeatNoAfters(seatIndex);
        return (unknownNoNeverPlay === "no" ||
            unknownNoNeverPlay === "never" ||
            unknownNoNeverPlay === "play");
    }
    _resetWhens() {
        const playerCount = TI4.config.playerCount;
        for (let seatIndex = 0; seatIndex < playerCount; seatIndex++) {
            // "never" is sticky, but "no" gets cleared.
            if (this._agendaState.getSeatNoWhens(seatIndex) === "no") {
                this._agendaState.setSeatNoWhens(seatIndex, "unknown");
            }
        }
    }
    _resetAfters() {
        const playerCount = TI4.config.playerCount;
        for (let seatIndex = 0; seatIndex < playerCount; seatIndex++) {
            // "never" is sticky, but "no" gets cleared.
            if (this._agendaState.getSeatNoAfters(seatIndex) === "no") {
                this._agendaState.setSeatNoAfters(seatIndex, "unknown");
            }
        }
    }
    _maybeAdvancePhaseWhens() {
        if (this._agendaState.getPhase() !== "whens") {
            return false;
        }
        if (!this._isLastPlayerInTurnOrder()) {
            return false;
        }
        // If a when was played and at the end of turn order, go again.
        if (this._isWhenPlayed()) {
            this._agendaState.transactThenTriggerDelayedStateChangedEvent(() => {
                this._resetWhens();
                TI4.turnOrder.nextTurn();
            });
            return true;
        }
        const order = new agenda_turn_order_1.AgendaTurnOrder().getWhensOrAftersOrder();
        const first = order[0];
        this._agendaState.transactThenTriggerDelayedStateChangedEvent(() => {
            if (first !== undefined) {
                TI4.turnOrder.setTurnOrder(order, "forward", first);
            }
            this._agendaState.setPhase("afters");
        });
        return true;
    }
    _maybeAdvancePhaseAfters() {
        if (this._agendaState.getPhase() !== "afters") {
            return false;
        }
        if (!this._isLastPlayerInTurnOrder()) {
            return false;
        }
        // If an after was played and at the end of turn order, go again.
        if (this._isAfterPlayed()) {
            this._agendaState.transactThenTriggerDelayedStateChangedEvent(() => {
                this._resetAfters();
                TI4.turnOrder.nextTurn();
            });
            return true;
        }
        const order = new agenda_turn_order_1.AgendaTurnOrder().getVotingOrder();
        const first = order[0];
        this._agendaState.transactThenTriggerDelayedStateChangedEvent(() => {
            if (first !== undefined) {
                TI4.turnOrder.setTurnOrder(order, "forward", first);
            }
            this._agendaState.setPhase("voting");
        });
        return true;
    }
    _maybeSkipTurnWhens() {
        if (this._agendaState.getPhase() !== "whens") {
            return false;
        }
        if (!this._isSkipTurnWhen()) {
            return false;
        }
        TI4.turnOrder.nextTurn();
        return true;
    }
    _maybeSkipTurnAfters() {
        if (this._agendaState.getPhase() !== "afters") {
            return false;
        }
        if (!this._isSkipTurnAfter()) {
            return false;
        }
        TI4.turnOrder.nextTurn();
        return true;
    }
    maybeAdvance() {
        /*
        // Do phase advance checks first, then skip turns.
        return (
          this._maybeAdvancePhaseWhens() ||
          this._maybeAdvancePhaseAfters() ||
          this._maybeSkipTurnWhens() ||
          this._maybeSkipTurnAfters()
        );
        */
        return false;
    }
}
exports.AdvanceNoWhensAfters = AdvanceNoWhensAfters;
//# sourceMappingURL=advance-no-whens-afters.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaOutcomes = exports.AGENDA_OUTCOME_TYPE_TO_LABEL = void 0;
exports.AGENDA_OUTCOME_TYPE_TO_LABEL = {
    "for-against": "For/Against",
    player: "Elect Player",
    "strategy-card": "Elect Strategy Card",
    other: "Other",
};
class AgendaOutcomes {
    /**
     * Do the populate as a transaction (rider processing gets batched).
     *
     * @param agendaState
     * @param outcomeType
     * @returns
     */
    populate(agendaState, outcomeType) {
        let result = false;
        agendaState.transactThenTriggerDelayedStateChangedEvent(() => {
            result = this._populate(agendaState, outcomeType);
        });
        return result;
    }
    _populate(agendaState, outcomeType) {
        let index = 0;
        if (outcomeType === "for-against") {
            agendaState.setOutcomeName(index++, "For");
            agendaState.setOutcomeName(index++, "Against");
            return true;
        }
        if (outcomeType === "player") {
            for (const seat of TI4.playerSeats.getAllSeats()) {
                const name = TI4.playerName.getBySlot(seat.playerSlot);
                agendaState.setOutcomeName(index++, name);
            }
            return true;
        }
        if (outcomeType === "strategy-card") {
            agendaState.setOutcomeName(index++, "Leadership");
            agendaState.setOutcomeName(index++, "Diplomacy");
            agendaState.setOutcomeName(index++, "Politics");
            agendaState.setOutcomeName(index++, "Construction");
            agendaState.setOutcomeName(index++, "Trade");
            agendaState.setOutcomeName(index++, "Warfare");
            agendaState.setOutcomeName(index++, "Technology");
            agendaState.setOutcomeName(index++, "Imperial");
            return true;
        }
        if (outcomeType === "other") {
            for (let i = 0; i < 8; i++) {
                agendaState.setOutcomeName(i, "");
            }
            return true;
        }
        return false;
    }
    populateOrThrow(agendaState, outcomeType) {
        if (!this.populate(agendaState, outcomeType)) {
            throw new Error(`Unknown outcome type: ${outcomeType}`);
        }
    }
}
exports.AgendaOutcomes = AgendaOutcomes;
//# sourceMappingURL=agenda-outcomes.js.map
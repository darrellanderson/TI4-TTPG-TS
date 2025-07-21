"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportFinalAgendaState = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class ReportFinalAgendaState {
    static isComplete(agendaState) {
        const order = TI4.turnOrder.getTurnOrder();
        const current = TI4.turnOrder.getCurrentTurn();
        const last = order[order.length - 1];
        let seatIndex = -1;
        if (last !== undefined) {
            seatIndex = TI4.playerSeats.getSeatIndexByPlayerSlot(last);
        }
        const phase = agendaState.getPhase();
        return (phase === "voting" &&
            current === last &&
            agendaState.getSeatVotesLocked(seatIndex));
    }
    static getOutcomeIndexToTotalVotes(agendaState) {
        const outcomeIndexToTotalVotes = new Map();
        for (let i = 0; i < agendaState.getNumOutcomes(); i++) {
            outcomeIndexToTotalVotes.set(i, 0);
        }
        for (let seatIndex = 0; seatIndex < TI4.config.playerCount; seatIndex++) {
            const outcomeIndex = agendaState.getSeatOutcomeChoice(seatIndex);
            const votes = agendaState.getSeatVotesForOutcome(seatIndex);
            const prevVotes = outcomeIndexToTotalVotes.get(outcomeIndex) || 0;
            const nextVotes = prevVotes + votes;
            outcomeIndexToTotalVotes.set(outcomeIndex, nextVotes);
        }
        return outcomeIndexToTotalVotes;
    }
    static getOutcomeSummaries(agendaState) {
        const outcomeIndexToTotalVotes = this.getOutcomeIndexToTotalVotes(agendaState);
        const outcomeSummaries = [];
        for (let i = 0; i < agendaState.getNumOutcomes(); i++) {
            const outcomeName = agendaState.getOutcomeName(i);
            const totalVotes = outcomeIndexToTotalVotes.get(i) || 0;
            const votingPlayerSlots = [];
            for (let seatIndex = 0; seatIndex < TI4.config.playerCount; seatIndex++) {
                if (agendaState.getSeatOutcomeChoice(seatIndex) === i) {
                    const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
                    votingPlayerSlots.push(playerSlot);
                }
            }
            if (outcomeName !== undefined) {
                outcomeSummaries.push({
                    outcomeIndex: i,
                    outcomeName,
                    totalVotes,
                    votingPlayerSlots,
                });
            }
        }
        // Sort by decreasing total votes.
        outcomeSummaries.sort((a, b) => b.totalVotes - a.totalVotes);
        return outcomeSummaries;
    }
    static sortOutcomeIndicesByDecreasingVoteCount(agendaState) {
        const outcomeIndexAndVotesArray = [];
        const playerCount = TI4.config.playerCount;
        for (let outcomeIndex = 0; outcomeIndex < agendaState.getNumOutcomes(); outcomeIndex++) {
            let votes = 0;
            for (let seatIndex = 0; seatIndex < playerCount; seatIndex++) {
                if (agendaState.getSeatOutcomeChoice(seatIndex) === outcomeIndex) {
                    votes += agendaState.getSeatVotesForOutcome(seatIndex);
                }
            }
            outcomeIndexAndVotesArray.push({ outcomeIndex, votes });
        }
        outcomeIndexAndVotesArray.sort((a, b) => b.votes - a.votes);
        return outcomeIndexAndVotesArray.map((entry) => entry.outcomeIndex);
    }
    static summary(agendaState) {
        const outcomeSummaries = this.getOutcomeSummaries(agendaState);
        const outcomeIndexByDecreasingVotes = this.sortOutcomeIndicesByDecreasingVoteCount(agendaState);
        const outcomeSummaryByDecreasingVotes = [];
        outcomeIndexByDecreasingVotes.forEach((outcomeIndex) => {
            const outcomeSummary = outcomeSummaries[outcomeIndex];
            if (outcomeSummary !== undefined) {
                outcomeSummaryByDecreasingVotes.push(outcomeSummary);
            }
        });
        const seats = TI4.playerSeats.getAllSeats();
        const summaries = outcomeSummaryByDecreasingVotes.map((outcomeSummary) => {
            const votingPlayers = outcomeSummary.votingPlayerSlots.map((playerSlot) => {
                return TI4.playerName.getBySlot(playerSlot);
            });
            const riders = agendaState
                .getRiders()
                .filter((rider) => rider.outcome === outcomeSummary.outcomeIndex)
                .map((rider) => {
                let playerName = "?";
                let riderName = "?";
                const seat = seats[rider.seat];
                if (seat) {
                    const playerSlot = seat.playerSlot;
                    playerName = TI4.playerName.getBySlot(playerSlot);
                }
                const obj = api_1.world.getObjectById(rider.objId);
                if (obj) {
                    if (obj instanceof api_1.Card) {
                        riderName = obj.getCardDetails().name;
                    }
                    else {
                        riderName = obj.getName();
                    }
                }
                return `${riderName} (${playerName})`;
            });
            let result = `"${outcomeSummary.outcomeName}" (votes: ${outcomeSummary.totalVotes} by ${votingPlayers.join(", ")})`;
            if (riders.length > 0) {
                result += ` with riders: ${riders.join(", ")}`;
            }
            return result;
        });
        return summaries.join(", ");
    }
    constructor(agendaState) {
        this._agendaState = agendaState;
        agendaState.onAgendaStateChanged.add(() => {
            if (ReportFinalAgendaState.isComplete(this._agendaState)) {
                const summary = ReportFinalAgendaState.summary(this._agendaState);
                ttpg_darrell_1.Broadcast.chatAll(summary);
            }
        });
    }
}
exports.ReportFinalAgendaState = ReportFinalAgendaState;
//# sourceMappingURL=report-final-agenda-state.js.map
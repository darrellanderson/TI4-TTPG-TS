import { PlayerSlot } from "ttpg-darrell";
import { AgendaState } from "./agenda-state";

export type AgendaOutcomeSummary = {
  outcomeIndex: number;
  outcomeName: string;
  totalVotes: number;
  votingPlayerSlots: Array<PlayerSlot>;
};

export class ReportFinalAgendaState {
  private readonly _agendaState: AgendaState;

  static isComplete(agendaState: AgendaState): boolean {
    const order: Array<PlayerSlot> = TI4.turnOrder.getTurnOrder();
    const current: PlayerSlot = TI4.turnOrder.getCurrentTurn();
    const last: PlayerSlot | undefined = order[order.length - 1];

    let seatIndex: number = -1;
    if (last !== undefined) {
      seatIndex = TI4.playerSeats.getSeatIndexByPlayerSlot(last);
    }

    const phase: "whens" | "afters" | "voting" = agendaState.getPhase();
    return (
      phase === "voting" &&
      current === last &&
      agendaState.getSeatVotesLocked(seatIndex)
    );
  }

  static getOutcomeIndexToTotalVotes(
    agendaState: AgendaState
  ): Map<number, number> {
    const outcomeIndexToTotalVotes: Map<number, number> = new Map();
    for (let i = 0; i < agendaState.getNumOutcomes(); i++) {
      outcomeIndexToTotalVotes.set(i, 0);
    }

    for (let seatIndex = 0; seatIndex < TI4.config.playerCount; seatIndex++) {
      const outcomeIndex: number = agendaState.getSeatOutcomeChoice(seatIndex);
      const votes: number = agendaState.getSeatVotesForOutcome(seatIndex);
      const prevVotes: number = outcomeIndexToTotalVotes.get(outcomeIndex) || 0;
      const nextVotes: number = prevVotes + votes;
      outcomeIndexToTotalVotes.set(outcomeIndex, nextVotes);
    }

    return outcomeIndexToTotalVotes;
  }

  static getOutcomeSummaries(
    agendaState: AgendaState
  ): Array<AgendaOutcomeSummary> {
    const outcomeIndexToTotalVotes: Map<number, number> =
      this.getOutcomeIndexToTotalVotes(agendaState);

    const outcomeSummaries: Array<AgendaOutcomeSummary> = [];
    for (let i = 0; i < agendaState.getNumOutcomes(); i++) {
      const outcomeName: string | undefined = agendaState.getOutcomeName(i);
      const totalVotes: number = outcomeIndexToTotalVotes.get(i) || 0;
      const votingPlayerSlots: Array<PlayerSlot> = [];
      for (let seatIndex = 0; seatIndex < TI4.config.playerCount; seatIndex++) {
        if (agendaState.getSeatOutcomeChoice(seatIndex) === i) {
          const playerSlot: PlayerSlot =
            TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
          votingPlayerSlots.push(playerSlot);
        }
      }

      if (outcomeName !== undefined && totalVotes > 0) {
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

  static summary(agendaState: AgendaState): string {
    const outcomeSummaries: Array<AgendaOutcomeSummary> =
      this.getOutcomeSummaries(agendaState);

    const summaries: Array<string> = outcomeSummaries.map((outcomeSummary) => {
      const votingPlayers: Array<string> = outcomeSummary.votingPlayerSlots.map(
        (playerSlot: number): string => {
          return TI4.playerName.getBySlot(playerSlot);
        }
      );
      return `"${outcomeSummary.outcomeName}" ${outcomeSummary.totalVotes} votes by ${votingPlayers.join(", ")}`;
    });
    return summaries.join(", ");
  }

  constructor(agendaState: AgendaState) {
    this._agendaState = agendaState;
  }
}

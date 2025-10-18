import { Card, GameObject, world } from "@tabletop-playground/api";
import { Broadcast, PlayerSlot } from "ttpg-darrell";

import { AgendaState } from "./agenda-state";
import { PlayerSeatType } from "../../player-lib/player-seats/player-seats";

export type AgendaOutcomeSummary = {
  outcomeIndex: number;
  outcomeName: string;
  totalVotes: number;
  votingPlayerSlots: Array<PlayerSlot>;
};

export class ReportFinalAgendaState {
  private readonly _agendaState: AgendaState;

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

      if (outcomeName !== undefined) {
        outcomeSummaries.push({
          outcomeIndex: i,
          outcomeName,
          totalVotes,
          votingPlayerSlots,
        });
      }
    }

    return outcomeSummaries;
  }

  static sortOutcomeIndicesByDecreasingVoteCount(
    agendaState: AgendaState
  ): Array<number> {
    type OutcomeIndexAndVotes = {
      outcomeIndex: number;
      votes: number;
    };
    const outcomeIndexAndVotesArray: Array<OutcomeIndexAndVotes> = [];

    const playerCount: number = TI4.config.playerCount;
    for (
      let outcomeIndex = 0;
      outcomeIndex < agendaState.getNumOutcomes();
      outcomeIndex++
    ) {
      let votes: number = 0;
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

  static summary(agendaState: AgendaState): string {
    const outcomeSummaries: Array<AgendaOutcomeSummary> =
      this.getOutcomeSummaries(agendaState);

    const outcomeIndexByDecreasingVotes: Array<number> =
      this.sortOutcomeIndicesByDecreasingVoteCount(agendaState);
    const outcomeSummaryByDecreasingVotes: Array<AgendaOutcomeSummary> = [];
    outcomeIndexByDecreasingVotes.forEach((outcomeIndex) => {
      const outcomeSummary: AgendaOutcomeSummary | undefined =
        outcomeSummaries[outcomeIndex];
      if (outcomeSummary !== undefined) {
        outcomeSummaryByDecreasingVotes.push(outcomeSummary);
      }
    });

    const seats: Array<PlayerSeatType> = TI4.playerSeats.getAllSeats();
    const summaries: Array<string> = outcomeSummaryByDecreasingVotes.map(
      (outcomeSummary) => {
        const votingPlayers: Array<string> =
          outcomeSummary.votingPlayerSlots.map((playerSlot: number): string => {
            return TI4.playerName.getBySlot(playerSlot);
          });
        const riders: Array<string> = agendaState
          .getRiders()
          .filter(
            (rider): boolean => rider.outcome === outcomeSummary.outcomeIndex
          )
          .map((rider): string => {
            let playerName: string = "?";
            let riderName: string = "?";

            const seat: PlayerSeatType | undefined = seats[rider.seat];
            if (seat) {
              const playerSlot = seat.playerSlot;
              playerName = TI4.playerName.getBySlot(playerSlot);
            }

            const obj: GameObject | undefined = world.getObjectById(
              rider.objId
            );
            if (obj) {
              if (obj instanceof Card) {
                riderName = obj.getCardDetails().name;
              } else {
                riderName = obj.getName();
              }
            }

            return `${riderName} (${playerName})`;
          });

        let result: string = `"${outcomeSummary.outcomeName}" (votes: ${outcomeSummary.totalVotes} by ${votingPlayers.join(", ")})`;
        if (riders.length > 0) {
          result += ` with riders: ${riders.join(", ")}`;
        }
        return result;
      }
    );

    const agendaCardId: string = agendaState.getAgendaObjId();
    const agendaCard: GameObject | undefined =
      world.getObjectById(agendaCardId);
    if (agendaCard && agendaCard instanceof Card) {
      const agendaCardName: string = agendaCard.getCardDetails().name;
      summaries.unshift(`AGENDA "${agendaCardName}" results:`);
    }
    return summaries.join("\n");
  }

  constructor(agendaState: AgendaState) {
    this._agendaState = agendaState;

    const onAgendaStateChanged = (): void => {
      if (this._agendaState.isComplete()) {
        // Only finish once.
        agendaState.onAgendaStateChanged.remove(onAgendaStateChanged);

        const summary: string = ReportFinalAgendaState.summary(
          this._agendaState
        );
        Broadcast.chatAll(summary);
      }
    };
    agendaState.onAgendaStateChanged.add(onAgendaStateChanged);
  }
}

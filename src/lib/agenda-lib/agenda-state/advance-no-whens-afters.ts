import { Broadcast, PlayerSlot } from "ttpg-darrell";
import { AgendaState } from "./agenda-state";
import { PlayerSeatType } from "../../player-lib/player-seats/player-seats";
import { AgendaTurnOrder } from "../agenda-turn-order/agenda-turn-order";

/**
 * Advance turn and/or phase when the current player has no whens or afters
 * during the appropriate phase.
 */
export class AdvanceNoWhensAfters {
  private readonly _agendaState: AgendaState;

  private readonly _onAgendaStateChangedHandler = () => {
    this.maybeAdvance();
  };

  constructor(agendaState: AgendaState) {
    this._agendaState = agendaState;
    this._agendaState.onAgendaStateChanged.add(
      this._onAgendaStateChangedHandler
    );
    this.maybeAdvance();
  }

  _isLastPlayerInTurnOrder(): boolean {
    const turnOrder: Array<PlayerSlot> = TI4.turnOrder.getTurnOrder();
    const currentTurn: PlayerSlot = TI4.turnOrder.getCurrentTurn();
    return currentTurn === turnOrder[turnOrder.length - 1];
  }

  _isWhenPlayed(): boolean {
    const playerCount: number = TI4.config.playerCount;
    for (let seatIndex = 0; seatIndex < playerCount; seatIndex++) {
      if (this._agendaState.getSeatNoWhens(seatIndex) === "unknown") {
        return true;
      }
    }
    return false;
  }

  _isAfterPlayed(): boolean {
    const playerCount: number = TI4.config.playerCount;
    for (let seatIndex = 0; seatIndex < playerCount; seatIndex++) {
      if (this._agendaState.getSeatNoAfters(seatIndex) === "unknown") {
        return true;
      }
    }
    return false;
  }

  _isSkipTurnWhen(): boolean {
    const current: PlayerSlot = TI4.turnOrder.getCurrentTurn();
    const seatIndex: number = TI4.playerSeats.getSeatIndexByPlayerSlot(current);
    const unknownNoNever: "unknown" | "no" | "never" =
      this._agendaState.getSeatNoWhens(seatIndex);
    return unknownNoNever === "no" || unknownNoNever === "never";
  }

  _isSkipTurnAfter(): boolean {
    const current: PlayerSlot = TI4.turnOrder.getCurrentTurn();
    const seatIndex: number = TI4.playerSeats.getSeatIndexByPlayerSlot(current);
    const unknownNoNever: "unknown" | "no" | "never" =
      this._agendaState.getSeatNoAfters(seatIndex);
    return unknownNoNever === "no" || unknownNoNever === "never";
  }

  _isSkipTurn(): boolean {
    if (this._agendaState.getPhase() === "whens") {
      return this._isSkipTurnWhen();
    } else if (this._agendaState.getPhase() === "afters") {
      return this._isSkipTurnAfter();
    } else {
      return false;
    }
  }

  maybeAdvance(): void {
    /*
    const turnOrder: Array<PlayerSlot> = TI4.turnOrder.getTurnOrder();
    const currentTurn: PlayerSlot = TI4.turnOrder.getCurrentTurn();
    const first: PlayerSlot | undefined = turnOrder[0];
    const isLast: boolean = currentTurn === turnOrder[turnOrder.length - 1];

    // Has any player played a when or after?
    let playedWhen: boolean = false;
    let playedAfter: boolean = false;
    const playerCount: number = TI4.config.playerCount;
    for (let seatIndex = 0; seatIndex < playerCount; seatIndex++) {
      if (this._agendaState.getSeatNoWhens(seatIndex) === "unknown") {
        playedWhen = true;
      }
      if (this._agendaState.getSeatNoAfters(seatIndex) === "unknown") {
        playedAfter = true;
      }
    }

    let seat: number = -1;
    TI4.playerSeats
      .getAllSeats()
      .forEach((playerSeat: PlayerSeatType, index: number) => {
        if (playerSeat.playerSlot === currentTurn) {
          seat = index;
        }
      });

    let unknownNoNever: "unknown" | "no" | "never" = "unknown";
    let skipTurn: boolean = false;
    if (this._agendaState.getPhase() === "whens") {
      unknownNoNever = this._agendaState.getSeatNoWhens(seat);
      skipTurn = unknownNoNever === "no" || unknownNoNever === "never";
    } else if (this._agendaState.getPhase() === "afters") {
      unknownNoNever = this._agendaState.getSeatNoAfters(seat);
      skipTurn = unknownNoNever === "no" || unknownNoNever === "never";
    }

    let advancePhase: boolean = true;
    if (isLast) {
      if (this._agendaState.getPhase() === "whens" && playedWhen) {
        advancePhase = false;
      } else if (this._agendaState.getPhase() === "afters" && playedAfter) {
        advancePhase = false;
      }
    }

    // Skip the turn if the player has no whens or afters.
    if (skipTurn) {
      const name: string = TI4.playerName.getBySlot(currentTurn);
      Broadcast.chatAll(`${name} plays no ${this._agendaState.getPhase()}`);

      if (isLast && first !== undefined) {
        // Skipping the last player in the turn order advances the phase.
        if (this._agendaState.getPhase() === "whens") {
          if (playedWhen) {
            for (let seatIndex = 0; seatIndex < playerCount; seatIndex++) {
              this._agendaState.setSeatNoWhens(seatIndex, "unknown");
            }
          } else {
            this._agendaState.setPhase("afters");
            TI4.turnOrder.setCurrentTurn(first);
          }
        } else if (this._agendaState.getPhase() === "afters") {
          if (playedAfter) {
            for (let seatIndex = 0; seatIndex < playerCount; seatIndex++) {
              this._agendaState.setSeatNoAfters(seatIndex, "unknown");
            }
          } else {
            this._agendaState.setPhase("voting");
            // Reset turn order to voting.
            const order: Array<PlayerSlot> =
              new AgendaTurnOrder().getVotingOrder();
            const first: PlayerSlot | undefined = order[0];
            if (first !== undefined) {
              TI4.turnOrder.setTurnOrder(order, "forward", first);
            }
          }
        }
      } else {
        // Advance turn.
        TI4.turnOrder.nextTurn();
      }
    }
      */
  }
}

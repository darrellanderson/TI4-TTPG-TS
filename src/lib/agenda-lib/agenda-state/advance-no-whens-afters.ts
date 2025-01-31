import { PlayerSlot } from "ttpg-darrell";
import { AgendaState } from "./agenda-state";
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

  _resetWhens(): void {
    const playerCount: number = TI4.config.playerCount;
    for (let seatIndex = 0; seatIndex < playerCount; seatIndex++) {
      // "never" is sticky, but "no" gets cleared.
      if (this._agendaState.getSeatNoWhens(seatIndex) === "no") {
        this._agendaState.setSeatNoWhens(seatIndex, "unknown");
      }
    }
  }

  _resetAfters(): void {
    const playerCount: number = TI4.config.playerCount;
    for (let seatIndex = 0; seatIndex < playerCount; seatIndex++) {
      // "never" is sticky, but "no" gets cleared.
      if (this._agendaState.getSeatNoAfters(seatIndex) === "no") {
        this._agendaState.setSeatNoAfters(seatIndex, "unknown");
      }
    }
  }

  _maybeAdvancePhaseWhens(): boolean {
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

    const order: Array<PlayerSlot> =
      new AgendaTurnOrder().getWhensOrAftersOrder();
    const first: PlayerSlot | undefined = order[0];
    this._agendaState.transactThenTriggerDelayedStateChangedEvent(() => {
      if (first !== undefined) {
        TI4.turnOrder.setTurnOrder(order, "forward", first);
      }
      this._agendaState.setPhase("afters");
    });
    return true;
  }

  _maybeAdvancePhaseAfters(): boolean {
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

    const order: Array<PlayerSlot> = new AgendaTurnOrder().getVotingOrder();
    const first: PlayerSlot | undefined = order[0];
    this._agendaState.transactThenTriggerDelayedStateChangedEvent(() => {
      if (first !== undefined) {
        TI4.turnOrder.setTurnOrder(order, "forward", first);
      }
      this._agendaState.setPhase("voting");
    });
    return true;
  }

  _maybeSkipTurnWhens(): boolean {
    if (this._agendaState.getPhase() !== "whens") {
      return false;
    }

    if (!this._isSkipTurnWhen()) {
      return false;
    }

    TI4.turnOrder.nextTurn();
    return true;
  }

  _maybeSkipTurnAfters(): boolean {
    if (this._agendaState.getPhase() !== "afters") {
      return false;
    }

    if (!this._isSkipTurnAfter()) {
      return false;
    }

    TI4.turnOrder.nextTurn();
    return true;
  }

  maybeAdvance(): boolean {
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

import { GameWorld } from "@tabletop-playground/api";
import { PlayerSlot } from "ttpg-darrell";
import { AgendaState } from "./agenda-state";
import { AgendaTurnOrder } from "../agenda-turn-order/agenda-turn-order";
import { PlayerSeatType } from "../../player-lib/player-seats/player-seats";

/**
 * Advance turn and/or phase when the current player has no whens or afters
 * during the appropriate phase.
 */
export class AdvanceNoWhensAfters {
  private readonly _agendaState: AgendaState;
  private _active: boolean = false;

  private readonly _onAgendaStateChangedHandler = (): void => {
    this.maybeAdvance();
  };

  constructor(agendaState: AgendaState) {
    this._agendaState = agendaState;
  }

  _getSeatPlayerSlots(): Array<PlayerSlot> {
    return TI4.playerSeats
      .getAllSeats()
      .map((seat: PlayerSeatType): PlayerSlot => seat.playerSlot);
  }

  /**
   * Enable automatic advancement (optional for unittests).
   *
   * @param force
   * @returns
   */
  activate(force?: boolean): this {
    if (
      !this._active &&
      (force || GameWorld.getExecutionReason() !== "unittest")
    ) {
      this._active = true;
      this._agendaState.onAgendaStateChanged.add(
        this._onAgendaStateChangedHandler
      );
      this.maybeAdvance();
    }
    return this;
  }

  /**
   * Get player slots that have not yet committed their whens.
   *
   * @returns
   */
  getUncommittedWhens(): Array<PlayerSlot> {
    return this._getSeatPlayerSlots()
      .filter((_playerSlot: PlayerSlot, seatIndex: number): boolean => {
        return this._agendaState.getSeatNoWhens(seatIndex) === "unknown";
      })
      .filter((playerSlot: PlayerSlot): boolean => {
        return (
          !TI4.turnOrder.getEliminated(playerSlot) &&
          !TI4.turnOrder.getPassed(playerSlot)
        );
      });
  }

  getPlayedWhens(): Array<PlayerSlot> {
    return this._getSeatPlayerSlots().filter(
      (_playerSlot: PlayerSlot, seatIndex: number): boolean => {
        return this._agendaState.getSeatNoWhens(seatIndex) === "play";
      }
    );
  }

  /**
   * Get player slots that have not yet committed their afters.
   *
   * @returns
   */
  getUncommittedAfters(): Array<PlayerSlot> {
    return this._getSeatPlayerSlots()
      .filter((_playerSlot: PlayerSlot, seatIndex: number): boolean => {
        return this._agendaState.getSeatNoAfters(seatIndex) === "unknown";
      })
      .filter((playerSlot: PlayerSlot): boolean => {
        return (
          !TI4.turnOrder.getEliminated(playerSlot) &&
          !TI4.turnOrder.getPassed(playerSlot)
        );
      });
  }

  getPlayedAfters(): Array<PlayerSlot> {
    return this._getSeatPlayerSlots().filter(
      (_playerSlot: PlayerSlot, seatIndex: number): boolean => {
        return this._agendaState.getSeatNoAfters(seatIndex) === "play";
      }
    );
  }

  /**
   *
   * @returns
   */
  getUncommittedVotes(): Array<PlayerSlot> {
    return this._getSeatPlayerSlots()
      .filter((_playerSlot: PlayerSlot, seatIndex: number): boolean => {
        return !this._agendaState.getSeatVotesLocked(seatIndex);
      })
      .filter((playerSlot: PlayerSlot): boolean => {
        return (
          !TI4.turnOrder.getEliminated(playerSlot) &&
          !TI4.turnOrder.getPassed(playerSlot)
        );
      });
  }

  /**
   * Get what's left of the turn order, starting with the current turn.
   *
   * @returns
   */
  getRemainingTurnOrder(): Array<PlayerSlot> {
    const order: Array<PlayerSlot> = TI4.turnOrder.getTurnOrder();
    const current: PlayerSlot = TI4.turnOrder.getCurrentTurn();
    const currentIndex: number = order.indexOf(current);
    if (currentIndex === -1) {
      return order;
    }
    return order.slice(currentIndex);
  }

  handlePhaseWhens(): boolean {
    if (this._agendaState.getPhase() !== "whens") {
      return false;
    }

    const uncommittedWhens: Array<PlayerSlot> = this.getUncommittedWhens();
    const playedWhens: Array<PlayerSlot> = this.getPlayedWhens();

    // Are we waiting on the current player?
    const current: PlayerSlot = TI4.turnOrder.getCurrentTurn();
    if (uncommittedWhens.includes(current)) {
      return true;
    }

    // Find the next player with uncommitted whens.
    // If we wrap, reset all "no" to "unknown".
    if (uncommittedWhens.length > 0 || playedWhens.length > 0) {
      const remainingTurnOrder: Array<PlayerSlot> =
        this.getRemainingTurnOrder();
      for (const playerSlot of remainingTurnOrder) {
        if (uncommittedWhens.includes(playerSlot)) {
          TI4.turnOrder.setCurrentTurn(playerSlot);
          return true;
        }
      }
      // Wrapped.
      this._agendaState.transactThenTriggerDelayedStateChangedEvent(
        (): void => {
          this._resetWhens();
          const order: Array<PlayerSlot> = TI4.turnOrder.getTurnOrder();
          for (const playerSlot of order) {
            if (uncommittedWhens.includes(playerSlot)) {
              TI4.turnOrder.setTurnOrder(order, "forward", playerSlot);
              break;
            }
          }
        }
      );
      return true;
    }

    // No uncommitted whens, advance to afters stage.
    this._agendaState.transactThenTriggerDelayedStateChangedEvent((): void => {
      this._agendaState.setPhase("afters");

      const order: Array<PlayerSlot> =
        new AgendaTurnOrder().getWhensOrAftersOrder();
      const first: PlayerSlot | undefined = order[0];
      if (first !== undefined) {
        TI4.turnOrder.setTurnOrder(order, "forward", first);
      }
    });
    return true;
  }

  handlePhaseAfters(): boolean {
    if (this._agendaState.getPhase() !== "afters") {
      return false;
    }

    const uncommittedAfters: Array<PlayerSlot> = this.getUncommittedAfters();
    const playedAfters: Array<PlayerSlot> = this.getPlayedAfters();

    // Are we waiting on the current player?
    const current: PlayerSlot = TI4.turnOrder.getCurrentTurn();
    if (uncommittedAfters.includes(current)) {
      return true;
    }

    // Find the next player with uncommitted afters.
    // If we wrap, reset all "no" to "unknown".
    if (uncommittedAfters.length > 0 || playedAfters.length > 0) {
      const remainingTurnOrder: Array<PlayerSlot> =
        this.getRemainingTurnOrder();
      for (const playerSlot of remainingTurnOrder) {
        if (uncommittedAfters.includes(playerSlot)) {
          TI4.turnOrder.setCurrentTurn(playerSlot);
          return true;
        }
      }
      // Wrapped.
      this._agendaState.transactThenTriggerDelayedStateChangedEvent(
        (): void => {
          this._resetAfters();
          const order: Array<PlayerSlot> = TI4.turnOrder.getTurnOrder();
          for (const playerSlot of order) {
            if (uncommittedAfters.includes(playerSlot)) {
              TI4.turnOrder.setTurnOrder(order, "forward", playerSlot);
              break;
            }
          }
        }
      );
      return true;
    }

    // No uncommitted afters, advance to voting stage.
    this._agendaState.transactThenTriggerDelayedStateChangedEvent((): void => {
      this._agendaState.setPhase("voting");

      const order: Array<PlayerSlot> = new AgendaTurnOrder().getVotingOrder();
      const first: PlayerSlot | undefined = order[0];
      if (first !== undefined) {
        TI4.turnOrder.setTurnOrder(order, "forward", first);
      }
    });
    return true;
  }

  handlePhaseVoting(): boolean {
    if (this._agendaState.getPhase() !== "voting") {
      return false;
    }

    const uncommittedVotes: Array<PlayerSlot> = this.getUncommittedVotes();

    // Are we waiting on the current player?
    const current: PlayerSlot = TI4.turnOrder.getCurrentTurn();
    if (uncommittedVotes.includes(current)) {
      return true;
    }

    // Find the next player with uncommitted votes.
    // If we wrap, reset all "no" to "unknown".
    if (uncommittedVotes.length > 0) {
      const remainingTurnOrder: Array<PlayerSlot> =
        this.getRemainingTurnOrder();
      for (const playerSlot of remainingTurnOrder) {
        if (uncommittedVotes.includes(playerSlot)) {
          TI4.turnOrder.setCurrentTurn(playerSlot);
          return true;
        }
      }
      // Wrapped (maybe a player unlocked their vote).
      const order: Array<PlayerSlot> = TI4.turnOrder.getTurnOrder();
      for (const playerSlot of order) {
        if (uncommittedVotes.includes(playerSlot)) {
          TI4.turnOrder.setTurnOrder(order, "forward", playerSlot);
          break;
        }
      }
      return true;
    }

    // No uncommitted votes, end voting stage.
    return false;
  }

  _resetWhens(): void {
    const playerCount: number = TI4.config.playerCount;
    for (let seatIndex = 0; seatIndex < playerCount; seatIndex++) {
      // "never" is sticky, but "no" gets cleared.
      if (this._agendaState.getSeatNoWhens(seatIndex) !== "never") {
        this._agendaState.setSeatNoWhens(seatIndex, "unknown");
      }
    }
  }

  _resetAfters(): void {
    const playerCount: number = TI4.config.playerCount;
    for (let seatIndex = 0; seatIndex < playerCount; seatIndex++) {
      // "never" is sticky, but "no" gets cleared.
      if (this._agendaState.getSeatNoAfters(seatIndex) !== "never") {
        this._agendaState.setSeatNoAfters(seatIndex, "unknown");
      }
    }
  }

  maybeAdvance(): boolean {
    // Advance to next player (possible wrap and reset), or next phase.
    return (
      this.handlePhaseWhens() ||
      this.handlePhaseAfters() ||
      this.handlePhaseVoting()
    );
  }
}

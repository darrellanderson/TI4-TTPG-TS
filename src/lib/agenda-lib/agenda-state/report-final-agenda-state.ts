import { PlayerSlot } from "ttpg-darrell";
import { AgendaState } from "./agenda-state";

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

  constructor(agendaState: AgendaState) {
    this._agendaState = agendaState;
  }
}

import { Card } from "@tabletop-playground/api";
import { IGlobal, NamespaceId, PlayerSlot } from "ttpg-darrell";

import { AbstractUI } from "../../../ui/abstract-ui/abtract-ui";
import { AgendaState } from "../agenda-state/agenda-state";
import { AgendaTurnOrder } from "../agenda-turn-order/agenda-turn-order";
import { AgendaStateUI } from "../../../ui/agenda-ui/agenda-state-ui/agenda-state-ui";
import {
  AbstractWindow,
  CreateAbstractUIType,
} from "../../../ui/abstract-window/abstract-window";

const AGENDA_STATE_NAMESPACE_ID: NamespaceId = "@ti4/agenda-state";
const AGENDA_WINDOW_NAMESPACE_ID: NamespaceId = "@ti4/agenda-window";

export class AgendaActivityMaybeResume implements IGlobal {
  init(): void {
    process.nextTick(() => {
      if (AgendaState.isAgendaInProgress(AGENDA_STATE_NAMESPACE_ID)) {
        new AgendaActivityStart().resume();
      }
    });
  }
}

export class AgendaActivityStart {
  private _agendaState: AgendaState | undefined;

  start(agendaCard: Card): boolean {
    this._agendaState = new AgendaState(
      AGENDA_STATE_NAMESPACE_ID
    ).setAgendaObjId(agendaCard.getId());

    // Set turn order.
    const order: Array<PlayerSlot> =
      new AgendaTurnOrder().getWhensOrAftersOrder();
    const first: PlayerSlot | undefined = order[0];
    if (first !== undefined) {
      TI4.turnOrder.setTurnOrder(order, "forward", first);
    }

    this.resume();
    return true;
  }

  resume(): this {
    const agendaState: AgendaState = new AgendaState(AGENDA_STATE_NAMESPACE_ID);
    this._agendaState = agendaState;

    // Create UI, window.
    const createAbstractUI: CreateAbstractUIType = (
      playerSlot: number,
      scale: number
    ): AbstractUI => {
      const seatIndex: number =
        TI4.playerSeats.getSeatIndexByPlayerSlot(playerSlot);
      return new AgendaStateUI(agendaState, seatIndex, scale);
    };
    const windowTitle: string = "Agenda";
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUI,
      AGENDA_WINDOW_NAMESPACE_ID,
      windowTitle
    );
    abstractWindow.getMutableWindowParams().disableClose = true;
    abstractWindow.createWindow().attach();

    return this;
  }

  destroy(): void {
    if (this._agendaState) {
      this._agendaState.destroy();
      this._agendaState = undefined;
    }
  }
}

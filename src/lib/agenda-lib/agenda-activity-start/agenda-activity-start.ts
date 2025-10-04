import { Card } from "@tabletop-playground/api";
import { IGlobal, NamespaceId, PlayerSlot, Window } from "ttpg-darrell";

import { AbstractUI } from "../../../ui/abstract-ui/abtract-ui";
import { AgendaState } from "../agenda-state/agenda-state";
import { AgendaTurnOrder } from "../agenda-turn-order/agenda-turn-order";
import { AgendaStateUI } from "../../../ui/agenda-ui/agenda-state-ui/agenda-state-ui";
import {
  AbstractWindow,
  CreateAbstractUIParams,
  CreateAbstractUIType,
} from "../../../ui/abstract-window/abstract-window";

export const AGENDA_STATE_NAMESPACE_ID: NamespaceId = "@ti4/agenda-state";
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
  private static _agendaWindow: Window | undefined = undefined;

  private readonly _onAgendaStateChangedHandler = (): void => {
    if (
      this._agendaState &&
      !this._agendaState.isActive() &&
      AgendaActivityStart._agendaWindow
    ) {
      this._agendaState.onAgendaStateChanged.remove(
        this._onAgendaStateChangedHandler
      );
      AgendaActivityStart._agendaWindow.detach();
      AgendaActivityStart._agendaWindow = undefined;
    }
  };

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
    if (AgendaActivityStart._agendaWindow) {
      AgendaActivityStart._agendaWindow.detach();
      AgendaActivityStart._agendaWindow = undefined;
    }

    const agendaState: AgendaState = new AgendaState(AGENDA_STATE_NAMESPACE_ID);

    this._agendaState = agendaState;
    this._agendaState.onAgendaStateChanged.add(
      this._onAgendaStateChangedHandler
    );

    // Create UI, window.
    const createAbstractUI: CreateAbstractUIType = (
      params: CreateAbstractUIParams
    ): AbstractUI => {
      const seatIndex: number = TI4.playerSeats.getSeatIndexByPlayerSlot(
        params.playerSlot
      );
      return new AgendaStateUI(agendaState, seatIndex, params.scale);
    };
    const windowTitle: string = "Agenda";
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUI,
      AGENDA_WINDOW_NAMESPACE_ID,
      windowTitle
    );
    abstractWindow.getMutableWindowParams().disableClose = true;
    AgendaActivityStart._agendaWindow = abstractWindow
      .addHost()
      .createWindow()
      .attach();

    return this;
  }

  destroy(): void {
    if (this._agendaState) {
      this._agendaState.onAgendaStateChanged.remove(
        this._onAgendaStateChangedHandler
      );
      this._agendaState.destroy();
      this._agendaState = undefined;
    }
  }
}

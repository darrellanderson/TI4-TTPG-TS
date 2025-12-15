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
import { SaveRestoreTurnOrder } from "../agenda-state/save-restore-turn-order";

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

  public static getAgendaWindow(): Window | undefined {
    return AgendaActivityStart._agendaWindow;
  }

  private readonly _onAgendaStateChangedHandler = (): void => {
    if (this._agendaState) {
      // Close window if agenda is no longer active.
      if (!this._agendaState.isActive() && AgendaActivityStart._agendaWindow) {
        this._agendaState.onAgendaStateChanged.remove(
          this._onAgendaStateChangedHandler
        );
        AgendaActivityStart._agendaWindow.detach();
        AgendaActivityStart._agendaWindow = undefined;
      }

      // Destroy agenda state if agenda is complete.
      if (this._agendaState.isComplete()) {
        this._agendaState.destroy();
      }
    }
  };

  start(agendaCard: Card): boolean {
    // Save current turn order state BEFORE updating turn order, clear passed.
    const turnOrderState: string = SaveRestoreTurnOrder.saveAndClearPassed();

    // Set turn order.
    const order: Array<PlayerSlot> =
      new AgendaTurnOrder().getWhensOrAftersOrder();
    const first: PlayerSlot | undefined = order[0];
    if (first !== undefined) {
      TI4.turnOrder.setTurnOrder(order, "forward", first);
    }

    this._agendaState = new AgendaState(AGENDA_STATE_NAMESPACE_ID)
      .setAgendaObjId(agendaCard.getId())
      .setTurnOrderState(turnOrderState);

    this.resume();
    return true;
  }

  resume(): this {
    if (AgendaActivityStart._agendaWindow) {
      AgendaActivityStart._agendaWindow.detach();
      AgendaActivityStart._agendaWindow = undefined;
    }

    // If resuming from a save need to create agenda state.
    // If proceeding from start it is already created.
    if (!this._agendaState) {
      const agendaState: AgendaState = new AgendaState(
        AGENDA_STATE_NAMESPACE_ID
      );
      this._agendaState = agendaState;
    }

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
      if (!this._agendaState) {
        throw new Error("Agenda state not initialized");
      }
      return new AgendaStateUI(this._agendaState, seatIndex, params.scale);
    };
    const windowTitle: string = "Agenda";
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUI,
      AGENDA_WINDOW_NAMESPACE_ID,
      windowTitle
    );
    abstractWindow
      .moveWindowLeftOfTurnOrder()
      .getMutableWindowParams().disableClose = false; // allow close, there is a toggle option
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

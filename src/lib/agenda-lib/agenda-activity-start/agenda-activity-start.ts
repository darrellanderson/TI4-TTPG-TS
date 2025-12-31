import { Card, GameObject, SnapPoint } from "@tabletop-playground/api";
import { Find, IGlobal, NamespaceId, PlayerSlot, Window } from "ttpg-darrell";

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
        // Make sure agenda card is still present.  If not clear agenda state.
        if (!this._isAgendaCardPresent()) {
          console.log(
            "AgendaActivityMaybeResume: Agenda card not present, destroying agenda state."
          );
          AgendaState.destroyAgendaState(AGENDA_STATE_NAMESPACE_ID);
        } else {
          new AgendaActivityStart().resume();
        }
      }
    });
  }

  _isAgendaCardPresent(): boolean {
    const find: Find = new Find();
    const snapPoint: SnapPoint | undefined =
      find.findSnapPointByTag("active-agenda");
    if (snapPoint) {
      const snappedObj: GameObject | undefined = snapPoint.getSnappedObject();
      if (snappedObj && snappedObj instanceof Card) {
        return true;
      }
    }
    return false;
  }
}

export class AgendaActivityStart {
  private static __agendaState: AgendaState | undefined;
  private static __agendaWindow: Window | undefined = undefined;

  public static getAgendaWindow(): Window | undefined {
    return AgendaActivityStart.__agendaWindow;
  }

  private readonly _onAgendaStateChangedHandler = (): void => {
    if (AgendaActivityStart.__agendaState) {
      // Close window if agenda is no longer active.
      if (
        !AgendaActivityStart.__agendaState.isActive() &&
        AgendaActivityStart.__agendaWindow
      ) {
        AgendaActivityStart.__agendaState.onAgendaStateChanged.remove(
          this._onAgendaStateChangedHandler
        );
        AgendaActivityStart.__agendaWindow.detach();
        AgendaActivityStart.__agendaWindow = undefined;
      }

      // Destroy agenda state if agenda is complete.
      if (AgendaActivityStart.__agendaState.isComplete()) {
        AgendaActivityStart.__agendaState.destroy();
        AgendaActivityStart.__agendaState = undefined;
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

    if (AgendaActivityStart.__agendaState) {
      AgendaActivityStart.__agendaState.destroy();
      AgendaActivityStart.__agendaState = undefined;
    }

    AgendaActivityStart.__agendaState = new AgendaState(
      AGENDA_STATE_NAMESPACE_ID
    )
      .setAgendaObjId(agendaCard.getId())
      .setTurnOrderState(turnOrderState);

    this.resume();
    return true;
  }

  resume(): this {
    if (AgendaActivityStart.__agendaWindow) {
      AgendaActivityStart.__agendaWindow.detach();
      AgendaActivityStart.__agendaWindow = undefined;
    }

    // If resuming from a save need to create agenda state.
    // If proceeding from start it is already created.
    if (!AgendaActivityStart.__agendaState) {
      AgendaActivityStart.__agendaState = new AgendaState(
        AGENDA_STATE_NAMESPACE_ID
      );
    }

    AgendaActivityStart.__agendaState.onAgendaStateChanged.add(
      this._onAgendaStateChangedHandler
    );

    // Create UI, window.
    const createAbstractUI: CreateAbstractUIType = (
      params: CreateAbstractUIParams
    ): AbstractUI => {
      const seatIndex: number = TI4.playerSeats.getSeatIndexByPlayerSlot(
        params.playerSlot
      );
      if (!AgendaActivityStart.__agendaState) {
        throw new Error("Agenda state not initialized");
      }
      return new AgendaStateUI(
        AgendaActivityStart.__agendaState,
        seatIndex,
        params.scale
      );
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

    const window: Window = (AgendaActivityStart.__agendaWindow = abstractWindow
      .addHost()
      .createWindow()
      .attach());

    window.onAllClosed.add((): void => {
      if (
        AgendaActivityStart.__agendaState &&
        AgendaActivityStart.__agendaState.isActive()
      ) {
        AgendaActivityStart.__agendaState.destroy();
        AgendaActivityStart.__agendaState = undefined;
      }
    });

    return this;
  }

  destroy(): void {
    if (AgendaActivityStart.__agendaState) {
      AgendaActivityStart.__agendaState.onAgendaStateChanged.remove(
        this._onAgendaStateChangedHandler
      );
      AgendaActivityStart.__agendaState.destroy();
      AgendaActivityStart.__agendaState = undefined;
    }
  }
}

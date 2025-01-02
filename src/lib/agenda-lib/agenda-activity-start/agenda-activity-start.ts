import { IGlobal, NamespaceId } from "ttpg-darrell";
import { AgendaState } from "../agenda-state/agenda-state";
import { Card } from "@tabletop-playground/api";

const AGENDA_NAMESPACE_ID: NamespaceId = "@ti4/agenda";

export class AgendaActivityMaybeResume implements IGlobal {
  init(): void {
    if (AgendaState.isAgendaInProgress(AGENDA_NAMESPACE_ID)) {
      new AgendaActivityStart().resume();
    }
  }
}

export class AgendaActivityStart {
  private _agendaState: AgendaState | undefined;

  private readonly _onAgendaStateChanged = (
    _agendaState: AgendaState
  ): void => {};

  start(agendaCard: Card): boolean {
    this._agendaState = new AgendaState(AGENDA_NAMESPACE_ID).setAgendaObjId(
      agendaCard.getId()
    );
    this._agendaState.onAgendaStateChanged.add(this._onAgendaStateChanged);

    // TODO: set turn order.

    this.resume();
    return true;
  }

  resume(): this {
    this._agendaState = new AgendaState(AGENDA_NAMESPACE_ID);

    // TODO: Create UI, window.

    return this;
  }

  destroy(): void {
    if (this._agendaState) {
      this._agendaState.destroy();
      this._agendaState = undefined;
    }
  }
}

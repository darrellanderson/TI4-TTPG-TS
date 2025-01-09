import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { CONFIG } from "../../config/config";
import { HorizontalUIBuilder } from "../../panel/horizontal-ui-builder";

export class AgendaStateUI extends AbstractUI {
  private readonly _agendaState: AgendaState;
  private readonly _onAgendaStateChangedHandler = () => {};

  constructor(agendaState: AgendaState, scale: number) {
    const abstractUi: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .build();
    super(abstractUi.getWidget(), abstractUi.getSize());

    this._agendaState = agendaState;
    this._agendaState.onAgendaStateChanged.add(
      this._onAgendaStateChangedHandler
    );
  }

  destroy(): void {
    super.destroy();
    this._agendaState.onAgendaStateChanged.remove(
      this._onAgendaStateChangedHandler
    );
  }
}

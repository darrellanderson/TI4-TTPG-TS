import { Button, LayoutBox, Player, Widget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { EditableButtonUI } from "../../button-ui/editable-button-ui";

/**
 * UI:
 * - Outcome name (Text and EditText in a WidgetSwitcher).
 * - Total votes (Text).
 * - Per-player votes (Text).
 * - Riders (Button, show zoomed rider on click).
 */
export class AgendaOutcomeUI extends AbstractUI {
  private readonly _agendaState: AgendaState;
  private readonly _outcomeIndex: number;

  readonly _onOutcomeClicked = (_button: Button, player: Player): void => {
    const playerSlot: number = player.getSlot();
    const seatIndex: number =
      TI4.playerSeats.getSeatIndexByPlayerSlot(playerSlot);
    this._agendaState.setSeatOutcomeChoice(seatIndex, this._outcomeIndex);
  };

  constructor(agendaState: AgendaState, outcomeIndex: number, scale: number) {
    const size: UI_SIZE = { w: 100 * scale, h: 100 * scale };

    const outcomeNameUi: EditableButtonUI = new EditableButtonUI(scale);

    const box: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(outcomeNameUi.getWidget());

    super(box, size);
    this._agendaState = agendaState;
    this._outcomeIndex = outcomeIndex;

    outcomeNameUi.getButton().onClicked.add(this._onOutcomeClicked);

    agendaState.onAgendaStateChanged.add(() => {
      const outcomeName: string =
        agendaState.getOutcomeName(outcomeIndex) ?? "";
      outcomeNameUi.getButton().setText(outcomeName);
    });
  }
}

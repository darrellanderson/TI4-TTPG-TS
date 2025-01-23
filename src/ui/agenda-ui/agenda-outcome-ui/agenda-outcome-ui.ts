import {
  Button,
  Color,
  Player,
  TextJustification,
  world,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { CONFIG } from "../../config/config";
import { EditableButtonUI } from "../../button-ui/editable-button-ui";
import { HorizontalUIBuilder } from "../../panel/horizontal-ui-builder";
import { LongRichTextUI } from "../../button-ui/long-richtext-ui";
import { ThrottleClickHandler } from "ttpg-darrell";

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

  readonly _onOutcomeClicked = new ThrottleClickHandler<Button>(
    (_button: Button, player: Player): void => {
      const playerSlot: number = player.getSlot();
      const seatIndex: number =
        TI4.playerSeats.getSeatIndexByPlayerSlot(playerSlot);
      this._agendaState.setSeatOutcomeChoice(seatIndex, this._outcomeIndex);
    }
  ).get();

  constructor(agendaState: AgendaState, outcomeIndex: number, scale: number) {
    const size: UI_SIZE = {
      w: CONFIG.BUTTON_WIDTH * scale * 3 + CONFIG.SPACING * 2,
      h: CONFIG.BUTTON_HEIGHT * scale,
    };

    const outcomeNameUi: EditableButtonUI = new EditableButtonUI(scale);
    const voteSummary: LongRichTextUI = new LongRichTextUI(
      CONFIG.BUTTON_WIDTH * 2 + CONFIG.SPACING,
      scale
    );
    voteSummary.getRichText().setJustification(TextJustification.Left);

    const ui: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([outcomeNameUi, voteSummary])
      .build();

    super(ui.getWidget(), size);
    this._agendaState = agendaState;
    this._outcomeIndex = outcomeIndex;

    outcomeNameUi.getButton().onClicked.add(this._onOutcomeClicked);

    agendaState.onAgendaStateChanged.add(() => {
      // Outcome name.
      const outcomeName: string =
        agendaState.getOutcomeName(outcomeIndex) ?? "";
      outcomeNameUi.getButton().setText(outcomeName);

      // Vote summary.
      const richVotes: Array<string> = [];
      let totalVotes: number = 0;
      TI4.playerSeats.getAllSeats().forEach((seat, index) => {
        const outcomeChoice: number = agendaState.getSeatOutcomeChoice(index);
        if (outcomeChoice === outcomeIndex) {
          const playerSlot: number = seat.playerSlot;
          const color: Color = world.getSlotColor(playerSlot);
          const colorHex: string = color.toHex().substring(0, 6).toLowerCase();
          const votes: number = agendaState.getSeatVotesForOutcome(index);
          richVotes.push(`[color=#${colorHex}]${votes}[/color]`);
          totalVotes += votes;
        }
      });
      let summary: string = `Votes: ${totalVotes}`;
      if (richVotes.length > 0) {
        summary += ` (${richVotes.join(", ")})`;
      }
      voteSummary.getRichText().setText(summary);
    });
  }
}

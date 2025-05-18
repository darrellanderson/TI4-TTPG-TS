import {
  Button,
  Color,
  Player,
  TextJustification,
  world,
} from "@tabletop-playground/api";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { CONFIG } from "../../config/config";
import { EditableButtonUI } from "../../button-ui/editable-button-ui";
import { HorizontalUIBuilder } from "../../panel/horizontal-ui-builder";
import { LongRichTextUI } from "../../button-ui/long-richtext-ui";
import { ThrottleClickHandler } from "ttpg-darrell";
import { AgendaRiderUI } from "./agenda-rider-ui";

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

      // If the player has cast zero votes, set votes to 1 so that the
      // chosen outcome is visible (must have a vote to display).
      if (this._agendaState.getSeatVotesForOutcome(seatIndex) === 0) {
        this._agendaState.setSeatVotesForOutcome(seatIndex, 1);
      }
    }
  ).get();

  readonly _onEdited: (text: string) => void;

  constructor(agendaState: AgendaState, outcomeIndex: number, scale: number) {
    const voteSummary: LongRichTextUI = new LongRichTextUI(
      CONFIG.BUTTON_WIDTH * scale,
      scale
    );
    voteSummary.getRichText().setJustification(TextJustification.Right);
    const outcomeNameUi: EditableButtonUI = new EditableButtonUI(scale);
    const riders: AbstractUI = new AgendaRiderUI(
      agendaState,
      outcomeIndex,
      scale
    );

    const ui: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([voteSummary, outcomeNameUi, riders])
      .build();

    super(ui.getWidget(), ui.getSize());
    this._agendaState = agendaState;
    this._outcomeIndex = outcomeIndex;

    this._onEdited = (text: string) => {
      agendaState.setOutcomeName(outcomeIndex, text);
    };

    outcomeNameUi.getButton().onClicked.add(this._onOutcomeClicked);
    outcomeNameUi.onEdited.add(this._onEdited);

    // Temporary workaround for rich text: need to set size for bold/etc elements.
    const fontSize: number = Math.round(CONFIG.FONT_SIZE * scale);

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
        const votes: number = agendaState.getSeatVotesForOutcome(index);
        if (outcomeChoice === outcomeIndex && votes > 0) {
          const playerSlot: number = seat.playerSlot;
          const color: Color = world.getSlotColor(playerSlot);
          const colorHex: string = color.toHex().substring(0, 6).toLowerCase();
          richVotes.push(
            `[color=#${colorHex}][size=${fontSize}]${votes}[/size][/color]`
          );
          totalVotes += votes;
        }
      });
      let summary: string = `${totalVotes}`;
      if (richVotes.length > 0) {
        summary += ` (${richVotes.join(", ")})`;
      }
      summary = `[b][size=${fontSize}]${summary}[/size][/b]`;
      voteSummary.getRichText().setText(summary);
    });
  }
}

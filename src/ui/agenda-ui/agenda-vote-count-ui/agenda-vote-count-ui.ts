import {
  Button,
  HorizontalBox,
  LayoutBox,
  Panel,
  TextBox,
  Widget,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { CONFIG } from "../../config/config";

/**
 * #editable [lock]
 */
export class AgendaVoteCountUI extends AbstractUI {
  private readonly _agendaState: AgendaState;
  private readonly _seatIndex: number;

  private readonly _votesTextBox: TextBox;
  private readonly _lockButton: Button;

  private _delayedApplyVotesHandle: NodeJS.Timeout | undefined;

  readonly _onLockClicked = (): void => {
    const oldLocked: boolean = this._agendaState.getSeatVotesLocked(
      this._seatIndex
    );
    const newLocked: boolean = !oldLocked;
    this._agendaState.setSeatVotesLocked(this._seatIndex, newLocked);
  };

  readonly _applyVoteCountToAgendaState = (): void => {
    this._delayedApplyVotesHandle = undefined;
    const votes: number = parseInt(this._votesTextBox.getText(), 10);
    this._agendaState.setSeatVotesForOutcome(this._seatIndex, votes);
  };

  readonly _onVotesChanged = (): void => {
    if (this._delayedApplyVotesHandle) {
      clearTimeout(this._delayedApplyVotesHandle);
      this._delayedApplyVotesHandle = undefined;
    }
    this._delayedApplyVotesHandle = setTimeout(
      this._applyVoteCountToAgendaState,
      500
    );
  };

  constructor(agendaState: AgendaState, seatIndex: number, scale: number) {
    const votesTextBox: TextBox = new TextBox()
      .setFontSize(CONFIG.FONT_SIZE * scale)
      .setMaxLength(3)
      .setInputType(4); // positive integers (or zero)

    const lockButton: Button = new Button().setFontSize(
      CONFIG.FONT_SIZE * scale
    );

    const panel: Panel = new HorizontalBox()
      .setChildDistance(CONFIG.SPACING * scale)
      .addChild(votesTextBox, 0.6)
      .addChild(lockButton, 0.4);

    const size: UI_SIZE = {
      w: CONFIG.BUTTON_WIDTH * scale,
      h: CONFIG.BUTTON_HEIGHT * scale,
    };
    const widget: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(panel);

    agendaState.onAgendaStateChanged.add(() => {
      const votes: number = agendaState.getSeatVotesForOutcome(seatIndex);
      const locked: boolean = agendaState.getSeatVotesLocked(seatIndex);
      votesTextBox.setText(votes.toString());
      votesTextBox.setEnabled(!locked);
      lockButton.setText(locked ? "Unlock" : "Lock");
    });

    super(widget, size);

    lockButton.onClicked.add(this._onLockClicked);
    votesTextBox.onTextCommitted.add(this._onVotesChanged);

    this._agendaState = agendaState;
    this._seatIndex = seatIndex;

    this._votesTextBox = votesTextBox;
    this._lockButton = lockButton;
  }

  destroy(): void {
    if (this._delayedApplyVotesHandle) {
      clearTimeout(this._delayedApplyVotesHandle);
      this._delayedApplyVotesHandle = undefined;
    }
    super.destroy();
  }
}

import {
  Button,
  Card,
  GameObject,
  Text,
  TextJustification,
  world,
} from "@tabletop-playground/api";
import { ThrottleClickHandler } from "ttpg-darrell";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { AgendaAvailableVotesUI } from "../agenda-available-votes-ui/agenda-available-votes-ui";
import {
  AgendaCardFaceDownUI,
  AgendaCardUI,
} from "../agenda-card-ui/agenda-card-ui";
import { AgendaHowToUI } from "../agenda-how-to-ui/agenda-how-to-ui";
import { AgendaOutcomeUI } from "../agenda-outcome-ui/agenda-outcome-ui";
import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { AgendaVoteCountUI } from "../agenda-vote-count-ui/agenda-vote-count-ui";
import { ButtonUI } from "../../button-ui/button-ui";
import { CONFIG } from "../../config/config";
import { HorizontalUIBuilder } from "../../panel/horizontal-ui-builder";
import { LabelUI } from "../../button-ui/label-ui";
import { LongLabelUI } from "../../button-ui/long-label-ui";
import { SwitcherUI } from "../../../ui/switcher-ui/switcher-ui";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";
import { AgendaChooseTypeUI } from "../agenda-choose-type-ui/agenda-choose-type-ui";
import { LongRichTextUI } from "../../button-ui/long-richtext-ui";

/**
 * [waiting for: ...]
 * [Available votes:] [Available votes]x3 [reset votes]
 * [1. My whens:] [play when] [no whens for now] [never whens] [reset whens]
 * [2. My afters:] [play after] [no afters for now] [never afters] [reset afters]
 * [Voting: choose outcome and set your votes for it below]
 * [...Outcome] [vote summary]+[]
 * [3. My votes:] [# + -] [lock votes] [reset votes]
 */
export class AgendaStateUI extends AbstractUI {
  private readonly _agendaState: AgendaState;
  private readonly _switcherUiOutcomeTypeThenMain: SwitcherUI;

  static _createAgendaCardUI(
    agendaState: AgendaState,
    scale: number
  ): AbstractUI {
    const objId: string = agendaState.getAgendaObjId();
    const agendaCard: GameObject | undefined = world.getObjectById(objId);
    if (!agendaCard || !(agendaCard instanceof Card)) {
      throw new Error("Agenda card missing or not card");
    }

    if (!agendaCard.isFaceUp()) {
      return new AgendaCardFaceDownUI(scale);
    }

    return new AgendaCardUI(agendaCard, scale);
  }

  static _createWaitingForRow(
    agendaState: AgendaState,
    scale: number
  ): AbstractUI {
    const label: LabelUI = new LabelUI(scale);
    label
      .getText()
      .setJustification(TextJustification.Right)
      .setText("Waiting for:");

    // Room for 4, but use 3 to center in the space.
    const scaledWidth: number =
      CONFIG.BUTTON_WIDTH * scale * 3 + CONFIG.SPACING * 2;
    const longLabel: LongLabelUI = new LongLabelUI(scaledWidth, scale);
    const text: Text = longLabel
      .getText()
      .setBold(true)
      .setFontSize(longLabel.getText().getFontSize() * 1.75);

    agendaState.onAgendaStateChanged.add(() => {
      const msg: string = agendaState.getWaitingForMessage();
      text.setText(msg.toUpperCase());
    });

    return new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([label, longLabel])
      .build();
  }

  static _createAvailableVotesRow(scale: number): AbstractUI {
    const label: LabelUI = new LabelUI(scale);
    label
      .getText()
      .setJustification(TextJustification.Right)
      .setText("Available votes:");

    const availableVotesUI: AgendaAvailableVotesUI = new AgendaAvailableVotesUI(
      CONFIG.BUTTON_WIDTH * scale * 3 + CONFIG.SPACING * 2,
      scale
    );

    const reset: ButtonUI = new ButtonUI(scale);
    reset.getButton().setText("Reset available votes");
    reset.getButton().onClicked.add(
      new ThrottleClickHandler<Button>(() => {
        availableVotesUI.update();
      }).get()
    );

    return new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([label, availableVotesUI, reset])
      .build();
  }

  static _createWhensRow(
    agendaState: AgendaState,
    seatIndex: number,
    scale: number
  ): AbstractUI {
    const label: LabelUI = new LabelUI(scale);
    label
      .getText()
      .setJustification(TextJustification.Right)
      .setText("My whens:");

    const playWhen: ButtonUI = new ButtonUI(scale);
    playWhen.getButton().setText("Play when");
    playWhen.getButton().onClicked.add(() => {
      agendaState.setSeatNoWhens(seatIndex, "play");
    });

    const noWhens: ButtonUI = new ButtonUI(scale);
    noWhens.getButton().setText("No whens (for now)");
    noWhens.getButton().onClicked.add(() => {
      agendaState.setSeatNoWhens(seatIndex, "no");
    });

    const neverWhens: ButtonUI = new ButtonUI(scale);
    neverWhens.getButton().setText("Never whens");
    neverWhens.getButton().onClicked.add(() => {
      agendaState.setSeatNoWhens(seatIndex, "never");
    });

    const reset: ButtonUI = new ButtonUI(scale);
    reset.getButton().setText("Reset whens");
    reset.getButton().onClicked.add(() => {
      agendaState.setSeatNoWhens(seatIndex, "unknown");
    });

    agendaState.onAgendaStateChanged.add(() => {
      const noNeverUnknownPlay: "no" | "never" | "unknown" | "play" =
        agendaState.getSeatNoWhens(seatIndex);
      noWhens.getButton().setEnabled(noNeverUnknownPlay === "unknown");
      neverWhens.getButton().setEnabled(noNeverUnknownPlay !== "never");
      playWhen.getButton().setEnabled(noNeverUnknownPlay === "unknown");
    });

    return new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([label, playWhen, noWhens, neverWhens, reset])
      .build();
  }

  static _createAftersRow(
    agendaState: AgendaState,
    seatIndex: number,
    scale: number
  ): AbstractUI {
    const label: LabelUI = new LabelUI(scale);
    label
      .getText()
      .setJustification(TextJustification.Right)
      .setText("My afters:");

    const playAfter: ButtonUI = new ButtonUI(scale);
    playAfter.getButton().setText("Play after");
    playAfter.getButton().onClicked.add(() => {
      agendaState.setSeatNoAfters(seatIndex, "play");
    });

    const noAfters: ButtonUI = new ButtonUI(scale);
    noAfters.getButton().setText("No afters (for now)");
    noAfters.getButton().onClicked.add(() => {
      agendaState.setSeatNoAfters(seatIndex, "no");
    });

    const neverAfters: ButtonUI = new ButtonUI(scale);
    neverAfters.getButton().setText("Never afters");
    neverAfters.getButton().onClicked.add(() => {
      agendaState.setSeatNoAfters(seatIndex, "never");
    });

    const reset: ButtonUI = new ButtonUI(scale);
    reset.getButton().setText("Reset afters");
    reset.getButton().onClicked.add(() => {
      agendaState.setSeatNoAfters(seatIndex, "unknown");
    });

    agendaState.onAgendaStateChanged.add(() => {
      const noNeverUnknownPlay: "no" | "never" | "unknown" | "play" =
        agendaState.getSeatNoAfters(seatIndex);
      noAfters.getButton().setEnabled(noNeverUnknownPlay === "unknown");
      neverAfters.getButton().setEnabled(noNeverUnknownPlay !== "never");
      playAfter.getButton().setEnabled(noNeverUnknownPlay === "unknown");
    });

    return new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([label, playAfter, noAfters, neverAfters, reset])
      .build();
  }

  /**
   * Votes: [not voting|#] [lock votes]
   *
   * @param agendaState
   * @param seatIndex
   * @param scale
   * @returns
   */
  static _createHowToVoteRow(
    agendaState: AgendaState,
    seatIndex: number,
    scale: number
  ): AbstractUI {
    const label: LabelUI = new LabelUI(scale);
    label
      .getText()
      .setJustification(TextJustification.Right)
      .setText("My votes:");

    const votes: AgendaVoteCountUI = new AgendaVoteCountUI(
      agendaState,
      seatIndex,
      scale
    );

    const scaledWidth: number =
      CONFIG.BUTTON_WIDTH * scale * 3 + CONFIG.SPACING * 2 * scale;
    const howTo: LongRichTextUI = new LongRichTextUI(scaledWidth, scale);
    howTo
      .getRichText()
      .setJustification(TextJustification.Left)
      .setText(
        "Select outcome below, add votes and lock. [b]To ABSTAIN lock zero votes.[/b]"
      );

    return new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([label, votes, howTo])
      .build();
  }

  static _createOutcomeUIs(
    agendaState: AgendaState,
    scale: number
  ): AbstractUI {
    const outcomeUIs: Array<AbstractUI> = [];
    for (let i = 0; i < 8; i++) {
      const outcomeUI: AbstractUI = new AgendaOutcomeUI(agendaState, i, scale);
      outcomeUIs.push(outcomeUI);
    }

    agendaState.onAgendaStateChanged.add((): void => {
      const numOutcomes: number = agendaState.getNumOutcomes();
      outcomeUIs.forEach((outcomeUI: AbstractUI, index: number) => {
        outcomeUI.getWidget().setVisible(index < numOutcomes);
      });
    });

    return new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(outcomeUIs)
      .build();
  }

  static _createTopLeftUI(
    agendaState: AgendaState,
    seatIndex: number,
    scale: number
  ): AbstractUI {
    const availableVotesUI: AbstractUI =
      AgendaStateUI._createAvailableVotesRow(scale);

    const howToUI: AbstractUI = new AgendaHowToUI(scale);

    const waitingForUI: AbstractUI = AgendaStateUI._createWaitingForRow(
      agendaState,
      scale
    );

    const whensUI: AbstractUI = AgendaStateUI._createWhensRow(
      agendaState,
      seatIndex,
      scale
    );

    const aftersUI: AbstractUI = AgendaStateUI._createAftersRow(
      agendaState,
      seatIndex,
      scale
    );

    const votingUI: AbstractUI = AgendaStateUI._createHowToVoteRow(
      agendaState,
      seatIndex,
      scale
    );

    return new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([
        howToUI,
        waitingForUI,
        availableVotesUI,
        whensUI,
        aftersUI,
        votingUI,
      ])
      .build();
  }

  static _createTopRightUI(
    agendaState: AgendaState,
    scale: number
  ): AbstractUI {
    const agendaCardUI: AbstractUI = AgendaStateUI._createAgendaCardUI(
      agendaState,
      scale
    );
    return agendaCardUI;
  }

  static _createBottomUI(agendaState: AgendaState, scale: number): AbstractUI {
    const outcomesUI: AbstractUI = AgendaStateUI._createOutcomeUIs(
      agendaState,
      scale
    );
    return outcomesUI;
  }

  constructor(agendaState: AgendaState, seatIndex: number, scale: number) {
    const topRowLeftUI: AbstractUI = AgendaStateUI._createTopLeftUI(
      agendaState,
      seatIndex,
      scale
    );

    const topRightUI: AbstractUI = AgendaStateUI._createTopRightUI(
      agendaState,
      scale
    );

    const bottomUI: AbstractUI = AgendaStateUI._createBottomUI(
      agendaState,
      scale
    );
    const outcomeTypeUi: AbstractUI = new AgendaChooseTypeUI(
      agendaState,
      scale
    );
    const switcherUi: SwitcherUI = new SwitcherUI([outcomeTypeUi, bottomUI]);

    const topUI: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([topRowLeftUI, topRightUI])
      .build();

    const ui: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([topUI, switcherUi])
      .build();

    super(ui.getWidget(), ui.getSize());

    this._agendaState = agendaState;
    this._switcherUiOutcomeTypeThenMain = switcherUi;

    // Switch to the main UI when outcome type is known.
    agendaState.onAgendaStateChanged.add(() => {
      if (agendaState.getNumOutcomes() > 0) {
        this._switcherUiOutcomeTypeThenMain.switchToIndex(1);
      }
    });

    // Trigger the event to update the UI.
    this._agendaState.onAgendaStateChanged.trigger(agendaState);
  }

  destroy(): void {
    super.destroy();
  }
}

import {
  Button,
  Card,
  GameObject,
  Text,
  TextJustification,
  VerticalAlignment,
  world,
} from "@tabletop-playground/api";
import { ThrottleClickHandler } from "ttpg-darrell";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { AgendaAvailableVotesUI } from "../agenda-available-votes-ui/agenda-available-votes-ui";
import { AgendaCardUI } from "../agenda-card-ui/agenda-card-ui";
import { AgendaOutcomeUI } from "../agenda-outcome-ui/agenda-outcome-ui";
import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { AgendaVoteCountUI } from "../agenda-vote-count-ui/agenda-vote-count-ui";
import { ButtonUI } from "../../button-ui/button-ui";
import { CONFIG } from "../../config/config";
import { HorizontalUIBuilder } from "../../panel/horizontal-ui-builder";
import { LabelUI } from "../../button-ui/label-ui";
import { LongLabelUI } from "../../button-ui/long-label-ui";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";

/**
 * [Available votes:] [Available votes]x2 [reset votes]
 * [1. My whens:] [no whens for now] [never whens] [reset whens]
 * [2. My afters:] [no afters for now] [never afters] [reset afters]
 * [Voting: choose outcome and set your votes for it below]
 * [...Outcome] [vote summary]+[]
 * [3. My votes:] [# + -] [lock votes] [reset votes]
 * [waiting for: ...]
 */
export class AgendaStateUI extends AbstractUI {
  private readonly _agendaState: AgendaState;
  private readonly _onAgendaStateChangedHandler = () => {};

  static _createAgendaCardUI(
    agendaState: AgendaState,
    scale: number
  ): AbstractUI {
    const objId: string = agendaState.getAgendaObjId();
    const agendaCard: GameObject | undefined = world.getObjectById(objId);
    if (!agendaCard || !(agendaCard instanceof Card)) {
      throw new Error("Agenda card missing or not card");
    }
    return new AgendaCardUI(agendaCard, scale);
  }

  static _createWaitingForRow(
    agendaState: AgendaState,
    scale: number
  ): AbstractUI {
    const scaledWidth: number =
      CONFIG.BUTTON_WIDTH * scale * 3 + CONFIG.SPACING * 2;
    const longLabel: LongLabelUI = new LongLabelUI(scaledWidth, scale);
    const text: Text = longLabel.getText();

    agendaState.onAgendaStateChanged.add(() => {
      const msg: string = agendaState.getWaitingForMessage();
      text.setText(msg);
    });

    return longLabel;
  }

  static _createAvailableVotesRow(scale: number): AbstractUI {
    const label: LabelUI = new LabelUI(scale);
    label.getText().setText("Available votes:");

    const availableVotesUI: AgendaAvailableVotesUI = new AgendaAvailableVotesUI(
      scale * 3,
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
    label.getText().setText("My whens:");

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
      const noNeverUnknown: "no" | "never" | "unknown" =
        agendaState.getSeatNoWhens(seatIndex);
      noWhens.getButton().setEnabled(noNeverUnknown === "unknown");
      neverWhens.getButton().setEnabled(noNeverUnknown !== "never");
    });

    return new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([label, noWhens, neverWhens, reset])
      .build();
  }

  static _createAftersRow(
    agendaState: AgendaState,
    seatIndex: number,
    scale: number
  ): AbstractUI {
    const label: LabelUI = new LabelUI(scale);
    label.getText().setText("My afters:");

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
      const noNeverUnknown: "no" | "never" | "unknown" =
        agendaState.getSeatNoAfters(seatIndex);
      noAfters.getButton().setEnabled(noNeverUnknown === "unknown");
      neverAfters.getButton().setEnabled(noNeverUnknown !== "never");
    });

    return new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([label, noAfters, neverAfters, reset])
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
    const scaledWidth: number =
      CONFIG.BUTTON_WIDTH * scale * 2 + CONFIG.SPACING * scale;
    const label: LongLabelUI = new LongLabelUI(scaledWidth, scale);
    label
      .getText()
      .setJustification(TextJustification.Right)
      .setText("Select outcome below.  Votes:");

    const votes: AgendaVoteCountUI = new AgendaVoteCountUI(
      agendaState,
      seatIndex,
      scale
    );

    return new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([label, votes])
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

    return new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(outcomeUIs)
      .build();
  }

  static _createTopRowUI(
    agendaState: AgendaState,
    seatIndex: number,
    scale: number
  ): AbstractUI {
    const agendaCardUI: AbstractUI = AgendaStateUI._createAgendaCardUI(
      agendaState,
      scale
    );

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

    const outcomeUIs: AbstractUI = AgendaStateUI._createOutcomeUIs(
      agendaState,
      scale
    );

    const whensAftersVotes: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([waitingForUI, whensUI, aftersUI, votingUI, outcomeUIs])
      .build();

    return new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .setVerticalAlignment(VerticalAlignment.Top)
      .addUIs([agendaCardUI, whensAftersVotes])
      .build();
  }

  constructor(agendaState: AgendaState, seatIndex: number, scale: number) {
    const topRowUI: AbstractUI = AgendaStateUI._createTopRowUI(
      agendaState,
      seatIndex,
      scale
    );

    const abstractUi: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([topRowUI])
      .build();
    super(abstractUi.getWidget(), abstractUi.getSize());

    this._agendaState = agendaState;
    this._agendaState.onAgendaStateChanged.add(
      this._onAgendaStateChangedHandler
    );

    // Trigger the event to update the UI.
    this._agendaState.onAgendaStateChanged.trigger(agendaState);
  }

  destroy(): void {
    super.destroy();
    this._agendaState.onAgendaStateChanged.remove(
      this._onAgendaStateChangedHandler
    );
  }
}

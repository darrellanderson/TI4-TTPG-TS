import {
  Card,
  GameObject,
  VerticalAlignment,
  world,
} from "@tabletop-playground/api";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { AgendaCardUI } from "../agenda-card-ui/agenda-card-ui";
import { ButtonUI } from "../../button-ui/button-ui";
import { CONFIG } from "../../config/config";
import { HorizontalUIBuilder } from "../../panel/horizontal-ui-builder";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";

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

  static _createWhensUI(
    agendaState: AgendaState,
    seatIndex: number,
    scale: number
  ): AbstractUI {
    const noWhens: ButtonUI = new ButtonUI(scale);
    noWhens.getButton().setText("No whens");
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
      .setSpacing(CONFIG.SPACING)
      .addUIs([noWhens, neverWhens, reset])
      .build();
  }

  static _createAftersUI(
    agendaState: AgendaState,
    seatIndex: number,
    scale: number
  ): AbstractUI {
    const noAfters: ButtonUI = new ButtonUI(scale);
    noAfters.getButton().setText("No afters");
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
      .setSpacing(CONFIG.SPACING)
      .addUIs([noAfters, neverAfters, reset])
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

    const whensUI: AbstractUI = AgendaStateUI._createWhensUI(
      agendaState,
      seatIndex,
      scale
    );

    const aftersUI: AbstractUI = AgendaStateUI._createAftersUI(
      agendaState,
      seatIndex,
      scale
    );

    const whensAfters: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING)
      .addUIs([whensUI, aftersUI])
      .build();

    return new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING)
      .setVerticalAlignment(VerticalAlignment.Top)
      .addUIs([agendaCardUI, whensAfters])
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
  }

  destroy(): void {
    super.destroy();
    this._agendaState.onAgendaStateChanged.remove(
      this._onAgendaStateChangedHandler
    );
  }
}

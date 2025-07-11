import {
  Button,
  Color,
  Player,
  refPackageId,
  TextJustification,
  world,
} from "@tabletop-playground/api";
import { Broadcast, PlayerSlot, ThrottleClickHandler } from "ttpg-darrell";

import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";

import { AbstractStrategyCardBody } from "../abstract-strategy-card-body/abstract-strategy-card-body";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { ButtonUI } from "../../button-ui/button-ui";
import { CONFIG } from "../../config/config";
import { LabelUI } from "../../button-ui/label-ui";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";
import { CreateZoomedUiType, ZoomableUI } from "../../zoomable-ui/zoomable-ui";
import { ZoomedStrategyCardUI } from "./zoomed-strategy-card-ui";

const packageId: string = refPackageId;

/**
 * 2x wide, with an abstract body below the title.
 * [Play|Follow] [Pass]
 */
export class StrategyCardUI extends AbstractUI {
  private readonly _strategyCardsState: StrategyCardsState;
  private readonly _strategyCardBody: AbstractStrategyCardBody;
  private readonly _playerSlot: PlayerSlot;

  private readonly _isPlay: boolean;
  private readonly _name: string;
  private readonly _ui: AbstractUI;
  private readonly _buttonPlayingPlayerFinished: Button;
  private readonly _buttonFollow: Button;
  private readonly _buttonPass: Button;

  private readonly _onPlayOrFollow = new ThrottleClickHandler<Button>(
    (_button: Button, player: Player): void => {
      const playerSlot: number = player.getSlot();
      const playerName: string = TI4.playerName.getBySlot(playerSlot);
      const parts: Array<string> = [
        `${playerName} ${this._isPlay ? "played" : "follows"} ${this._name}`,
      ];
      const report: string | undefined = this._strategyCardBody.getReport();
      if (report) {
        parts.push(report);
      }
      const msg: string = parts.join(" : ");
      const color: Color = world.getSlotColor(playerSlot);
      Broadcast.chatAll(msg, color);
      this._strategyCardsState.remove(
        this._playerSlot,
        this._strategyCardBody.getStrategyCardNumber()
      );
    }
  ).get();

  private readonly _onPass = new ThrottleClickHandler<Button>(
    (_button: Button, player: Player): void => {
      const playerSlot: number = player.getSlot();
      const playerName: string = TI4.playerName.getBySlot(playerSlot);
      const msg: string = `${playerName} passes on ${this._name}`;
      const color: Color = world.getSlotColor(playerSlot);
      Broadcast.chatAll(msg, color);
      this._strategyCardsState.remove(
        this._playerSlot,
        this._strategyCardBody.getStrategyCardNumber()
      );
    }
  ).get();

  constructor(
    scale: number,
    strategyCardsState: StrategyCardsState,
    strategyCardBody: AbstractStrategyCardBody,
    playerSlot: PlayerSlot
  ) {
    const strategyCardNumber: number = strategyCardBody.getStrategyCardNumber();
    const body: AbstractUI | undefined = strategyCardBody.getBody(scale);

    const name: string = strategyCardBody.getStrategyCardName();
    const titleUi: LabelUI = new LabelUI(scale);
    titleUi
      .getText()
      .setFont("handel-gothic-regular.ttf", packageId)
      .setFontSize(CONFIG.FONT_SIZE * scale * 1.1)
      .setJustification(TextJustification.Left)
      .setText(name.toUpperCase());

    const createZoomedStrategyCardUI: CreateZoomedUiType =
      ZoomedStrategyCardUI.generateCreateZoomedUi(strategyCardNumber);
    const zoomableTitleUi: ZoomableUI = new ZoomableUI(
      titleUi,
      scale,
      createZoomedStrategyCardUI
    );

    const isPlay: boolean =
      strategyCardsState.getLastPlayerSlotPlayed(strategyCardNumber) ===
      playerSlot;

    const buttonPlayingPlayerFinished: ButtonUI = new ButtonUI(scale);
    buttonPlayingPlayerFinished.getButton().setText("Finished");

    const buttonFollow: ButtonUI = new ButtonUI(scale);
    buttonFollow.getButton().setText("Follow");

    const buttonPass: ButtonUI = new ButtonUI(scale);
    buttonPass.getButton().setText("Pass");

    const uis: Array<AbstractUI> = [zoomableTitleUi];
    if (body) {
      uis.push(body);
    }
    if (isPlay) {
      uis.push(buttonPlayingPlayerFinished);
    } else {
      uis.push(buttonFollow, buttonPass);
    }

    const ui: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(uis)
      .build();

    super(ui.getWidget(), ui.getSize());
    this._strategyCardsState = strategyCardsState;
    this._strategyCardBody = strategyCardBody;
    this._playerSlot = playerSlot;
    this._isPlay = isPlay;
    this._name = name;
    this._ui = ui;
    this._buttonPlayingPlayerFinished = buttonPlayingPlayerFinished.getButton();
    this._buttonFollow = buttonFollow.getButton();
    this._buttonPass = buttonPass.getButton();

    buttonPlayingPlayerFinished.getButton().onClicked.add(this._onPlayOrFollow);
    buttonFollow.getButton().onClicked.add(this._onPlayOrFollow);
    buttonPass.getButton().onClicked.add(this._onPass);
  }

  destroy(): void {
    this._ui.destroy();
  }

  getButtonPlayingPlayerFinished(): Button {
    return this._buttonPlayingPlayerFinished;
  }

  getButtonFollow(): Button {
    return this._buttonFollow;
  }

  getButtonPass(): Button {
    return this._buttonPass;
  }
}

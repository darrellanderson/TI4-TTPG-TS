import {
  Button,
  Color,
  Player,
  refPackageId,
  TextJustification,
  world,
} from "@tabletop-playground/api";
import {
  Broadcast,
  ThrottleClickHandler,
  TriggerableMulticastDelegate,
} from "ttpg-darrell";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { ButtonUI } from "../../button-ui/button-ui";
import { CONFIG } from "../../config/config";
import { HorizontalUIBuilder } from "../../panel/horizontal-ui-builder";
import { LabelUI } from "../../button-ui/label-ui";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";

const packageId: string = refPackageId;

/**
 * 2x wide, with an abstract body below the title.
 * [Play|Follow] [Pass]
 */
export abstract class AbstractStrategyCardUI extends AbstractUI {
  public readonly onCloseClicked: TriggerableMulticastDelegate<() => void> =
    new TriggerableMulticastDelegate<() => void>();

  private readonly _name: string;
  private readonly _ui: AbstractUI;

  private readonly _onPlay = new ThrottleClickHandler<Button>(
    (_button: Button, player: Player): void => {
      const playerSlot: number = player.getSlot();
      const playerName: string = TI4.playerName.getBySlot(playerSlot);
      const parts: Array<string> = [`${playerName} plays ${this._name}`];
      const report: string | undefined = this.getReport();
      if (report) {
        parts.push(report);
      }
      const msg: string = parts.join(" : ");
      const color: Color = world.getSlotColor(playerSlot);
      Broadcast.chatAll(msg, color);
      this.onCloseClicked.trigger();
    }
  ).get();

  private readonly _onFollow = new ThrottleClickHandler<Button>(
    (_button: Button, player: Player): void => {
      const playerSlot: number = player.getSlot();
      const playerName: string = TI4.playerName.getBySlot(playerSlot);
      const parts: Array<string> = [`${playerName} follows ${this._name}`];
      const report: string | undefined = this.getReport();
      if (report) {
        parts.push(report);
      }
      const msg: string = parts.join(" : ");
      const color: Color = world.getSlotColor(playerSlot);
      Broadcast.chatAll(msg, color);
      this.onCloseClicked.trigger();
    }
  ).get();

  private readonly _onPass = new ThrottleClickHandler<Button>(
    (_button: Button, player: Player): void => {
      const playerSlot: number = player.getSlot();
      const playerName: string = TI4.playerName.getBySlot(playerSlot);
      const msg: string = `${playerName} passes ${this._name}`;
      const color: Color = world.getSlotColor(playerSlot);
      Broadcast.chatAll(msg, color);
      this.onCloseClicked.trigger();
    }
  ).get();

  constructor(
    scale: number,
    name: string,
    isPlay: boolean,
    body: AbstractUI | undefined
  ) {
    const titleUi: LabelUI = new LabelUI(scale);
    titleUi
      .getText()
      .setFont("handel-gothic-regular.ttf", packageId)
      .setFontSize(CONFIG.FONT_SIZE * scale * 1.5)
      .setJustification(TextJustification.Left)
      .setText(name.toUpperCase());

    const buttonPlay: ButtonUI = new ButtonUI(scale);
    buttonPlay.getButton().setText("Play");

    const buttonFollow: ButtonUI = new ButtonUI(scale);
    buttonFollow.getButton().setText("Follow");

    const buttonPass: ButtonUI = new ButtonUI(scale);
    buttonPass.getButton().setText("Pass");

    const bottomUis: AbstractUI[] = [
      isPlay ? buttonPlay : buttonFollow,
      buttonPass,
    ];
    const bottomRow: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(bottomUis)
      .build();

    const uis: Array<AbstractUI> = [titleUi];
    if (body) {
      uis.push(body);
    }
    uis.push(bottomRow);
    const ui: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(uis)
      .build();

    super(ui.getWidget(), ui.getSize());
    this._name = name;
    this._ui = ui;

    buttonPlay.getButton().onClicked.add(this._onPlay);
    buttonFollow.getButton().onClicked.add(this._onFollow);
    buttonPass.getButton().onClicked.add(this._onPass);
  }

  destroy(): void {
    this._ui.destroy();
    this.onCloseClicked.clear();
  }

  getReport(): string | undefined {
    return undefined;
  }
}

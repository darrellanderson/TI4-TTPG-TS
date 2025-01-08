import {
  Button,
  ContentButton,
  HorizontalAlignment,
  Player,
} from "@tabletop-playground/api";
import { ColorLib, COLORS, ColorsType } from "ttpg-darrell";

import { AbstractUI } from "../abstract-ui/abtract-ui";
import { ButtonUI } from "../button-ui/button-ui";
import { ColorChoiceButton } from "./color-choice-button";
import { CONFIG } from "../config/config";
import { HorizontalUIBuilder } from "../panel/horizontal-ui-builder";
import { LabelUI } from "../button-ui/label-ui";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";

export class ChangeColorUI extends AbstractUI {
  private readonly _cancelButton: Button;

  static _getAllColorNames(): Array<string> {
    return Object.keys(COLORS);
  }

  static _getClickHandler(
    targetPlayerSlot: number,
    colorName: string,
    colorHex: string
  ): (button: ContentButton, player: Player) => void {
    return (_button: ContentButton, player: Player) => {
      TI4.events.onPlayerChangedColor.trigger(
        targetPlayerSlot,
        colorName,
        colorHex,
        player
      );
    };
  }

  static _getColorRow(
    colorName: string,
    targetPlayerSlot: number,
    scale: number
  ): AbstractUI {
    const colorLib: ColorLib = new ColorLib();

    const nameUi: LabelUI = new LabelUI(scale);
    nameUi.getText().setText(colorName);

    const uis: Array<AbstractUI> = [nameUi];

    const numColors: number = colorLib.getColorsLengthOrThrow(colorName);
    for (let i = 0; i < numColors; i++) {
      const colorsType: ColorsType = colorLib.getColorsByNameOrThrow(
        colorName,
        i
      );
      const colorHex: string = colorsType.widget;
      const colorUi: ColorChoiceButton = new ColorChoiceButton(colorHex, scale);

      colorUi
        .getContentButton()
        .onClicked.add(
          ChangeColorUI._getClickHandler(targetPlayerSlot, colorName, colorHex)
        );

      uis.push(colorUi);
    }

    return new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(uis)
      .build();
  }

  constructor(targetPlayerSlot: number, scale: number) {
    const uis: Array<AbstractUI> = [];

    const colorNames: Array<string> = ChangeColorUI._getAllColorNames();
    for (const colorName of colorNames) {
      uis.push(ChangeColorUI._getColorRow(colorName, targetPlayerSlot, scale));
    }

    const cancelButton: ButtonUI = new ButtonUI(scale);
    cancelButton.getButton().setText("Cancel");
    uis.push(cancelButton);

    const abstractUi: AbstractUI = new VerticalUIBuilder()
      .setHorizontalAlignment(HorizontalAlignment.Right)
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(uis)
      .build();

    super(abstractUi.getWidget(), abstractUi.getSize());

    this._cancelButton = cancelButton.getButton();
  }

  getCancelButton(): Button {
    return this._cancelButton;
  }
}

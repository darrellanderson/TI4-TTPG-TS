import { ColorLib, COLORS, ColorsType } from "ttpg-darrell";

import { AbstractUI } from "../abstract-ui/abtract-ui";
import { ColorChoiceButton } from "./color-choice-button";
import { CONFIG } from "../config/config";
import { HorizontalUIBuilder } from "../panel/horizontal-ui-builder";
import { LabelUI } from "../button-ui/label-ui";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";

export class ChangeColorUI extends AbstractUI {
  static _getAllColorNames(): Array<string> {
    return Object.keys(COLORS);
  }

  static _getColorRow(colorName: string, scale: number): AbstractUI {
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
      uis.push(colorUi);
    }

    return new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(uis)
      .build();
  }

  constructor(scale: number) {
    const uis: Array<AbstractUI> = [];

    const colorNames: Array<string> = ChangeColorUI._getAllColorNames();
    for (const colorName of colorNames) {
      uis.push(ChangeColorUI._getColorRow(colorName, scale));
    }

    const abstractUi: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(uis)
      .build();

    super(abstractUi.getWidget(), abstractUi.getSize());
  }
}

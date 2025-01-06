import { ColorLib, COLORS } from "ttpg-darrell";

import { AbstractUI } from "../abstract-ui/abtract-ui";
import { CONFIG } from "../config/config";
import { HorizontalUIBuilder } from "../panel/horizontal-ui-builder";
import { LabelUI } from "../button-ui/label-ui";

export class ChangeColorUI extends AbstractUI {
  private readonly _colorLib: ColorLib = new ColorLib();

  static getAllColorNames(): Array<string> {
    return Object.keys(COLORS);
  }

  _getColorRow(colorName: string, scale: number): AbstractUI {
    const nameUi: LabelUI = new LabelUI(scale);
    nameUi.getText().setText(colorName);

    const uis: Array<AbstractUI> = [nameUi];

    return new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING)
      .addUIs(uis)
      .build();
  }
}

import {
  CheckBox,
  HorizontalAlignment,
  LayoutBox,
  VerticalAlignment,
  Widget,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { CONFIG } from "../config/config";

export class CheckBoxUI extends AbstractUI {
  private readonly _checkBox: CheckBox;

  constructor(scale: number) {
    const fontSize: number = CONFIG.FONT_SIZE * scale;

    const checkBox: CheckBox = new CheckBox()
      .setFontSize(fontSize)
      .setText("X");

    const size: UI_SIZE = {
      w: CONFIG.BUTTON_WIDTH * scale,
      h: CONFIG.BUTTON_HEIGHT * scale,
    };
    const widget: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setHorizontalAlignment(HorizontalAlignment.Fill)
      .setVerticalAlignment(VerticalAlignment.Fill)
      .setChild(checkBox);

    super(widget, size);
    this._checkBox = checkBox;
  }

  destroy(): void {
    this._checkBox.onCheckStateChanged.clear();
  }

  getCheckBox(): CheckBox {
    return this._checkBox;
  }
}

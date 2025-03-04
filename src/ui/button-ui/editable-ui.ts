import {
  HorizontalAlignment,
  LayoutBox,
  TextBox,
  VerticalAlignment,
  Widget,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { CONFIG } from "../config/config";

export class EditableUI extends AbstractUI {
  private readonly _editText: TextBox;

  constructor(scale: number) {
    const fontSize: number = CONFIG.FONT_SIZE * scale;

    const editText: TextBox = new TextBox().setFontSize(fontSize);

    const size: UI_SIZE = {
      w: CONFIG.BUTTON_WIDTH * scale,
      h: CONFIG.BUTTON_HEIGHT * scale,
    };
    const widget: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setHorizontalAlignment(HorizontalAlignment.Fill)
      .setVerticalAlignment(VerticalAlignment.Fill)
      .setChild(editText);

    super(widget, size);
    this._editText = editText;
  }

  getEditText(): TextBox {
    return this._editText;
  }
}

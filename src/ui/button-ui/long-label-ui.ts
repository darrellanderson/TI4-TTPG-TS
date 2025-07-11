import {
  HorizontalAlignment,
  LayoutBox,
  Text,
  TextJustification,
  VerticalAlignment,
  Widget,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { CONFIG } from "../config/config";

export class LongLabelUI extends AbstractUI {
  private readonly _text: Text;

  constructor(scaledWidth: number, scale: number) {
    const fontSize: number = CONFIG.FONT_SIZE * scale;

    const text: Text = new Text()
      .setFontSize(fontSize)
      .setJustification(TextJustification.Center)
      .setText("X");

    const size: UI_SIZE = {
      w: scaledWidth,
      h: CONFIG.BUTTON_HEIGHT * scale,
    };
    const widget: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setHorizontalAlignment(HorizontalAlignment.Fill)
      .setVerticalAlignment(VerticalAlignment.Center)
      .setChild(text);

    super(widget, size);
    this._text = text;
  }

  getText(): Text {
    return this._text;
  }
}

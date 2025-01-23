import {
  HorizontalAlignment,
  LayoutBox,
  RichText,
  TextJustification,
  VerticalAlignment,
  Widget,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { CONFIG } from "../config/config";

export class LongRichTextUI extends AbstractUI {
  private readonly _richText: RichText;

  constructor(scaledWidth: number, scale: number) {
    const fontSize: number = CONFIG.FONT_SIZE * scale;

    const richText: RichText = new RichText()
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
      .setChild(richText);

    super(widget, size);
    this._richText = richText;
  }

  getRichText(): RichText {
    return this._richText;
  }
}

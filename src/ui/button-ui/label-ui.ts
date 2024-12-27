import {
  Button,
  HorizontalAlignment,
  LayoutBox,
  Text,
  VerticalAlignment,
  Widget,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

const FONT_SIZE: number = 12;

export class LabelUI extends AbstractUI {
  private readonly _text: Text;

  constructor(scale: number) {
    const fontSize: number = FONT_SIZE * scale;

    const text: Text = new Text().setFontSize(fontSize).setText("X");

    const size: UI_SIZE = {
      w: 100 * scale,
      h: fontSize * 3,
    };
    const widget: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setHorizontalAlignment(HorizontalAlignment.Fill)
      .setVerticalAlignment(VerticalAlignment.Fill)
      .setChild(text);

    super(widget, size);
    this._text = text;
  }

  getText(): Text {
    return this._text;
  }
}

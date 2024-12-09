import {
  Button,
  HorizontalAlignment,
  LayoutBox,
  VerticalAlignment,
  Widget,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

const FONT_SIZE: number = 12;

export class ButtonUI extends AbstractUI {
  private readonly _button: Button;

  constructor(scale: number) {
    const fontSize: number = FONT_SIZE * scale;

    const button: Button = new Button().setFontSize(fontSize).setText("X");

    const size: UI_SIZE = {
      w: 100 * scale,
      h: fontSize * 3,
    };
    const widget: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setHorizontalAlignment(HorizontalAlignment.Fill)
      .setVerticalAlignment(VerticalAlignment.Fill)
      .setChild(button);

    super(widget, size);
    this._button = button;
  }

  getButton(): Button {
    return this._button;
  }
}

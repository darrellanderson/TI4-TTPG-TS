import { Button, LayoutBox, Widget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

const FONT_SIZE: number = 12;

export class ButtonUI extends AbstractUI {
  private readonly _button: Button;

  constructor(scale: number) {
    const button: Button = new Button()
      .setFontSize(FONT_SIZE * scale)
      .setText("X");

    const size: UI_SIZE = {
      w: 100,
      h: 100,
    };
    const widget: Widget = new LayoutBox().setChild(button);

    super(widget, size);
    this._button = button;
  }

  getButton(): Button {
    return this._button;
  }
}

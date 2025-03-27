import {
  Button,
  HorizontalAlignment,
  LayoutBox,
  VerticalAlignment,
  Widget,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { CONFIG } from "../config/config";

export class LongButtonUI extends AbstractUI {
  private readonly _button: Button;

  constructor(scaledWidth: number, scale: number) {
    const fontSize: number = CONFIG.FONT_SIZE * scale;

    const button: Button = new Button().setFontSize(fontSize).setText("X");

    const size: UI_SIZE = {
      w: scaledWidth,
      h: CONFIG.BUTTON_HEIGHT * scale,
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

  destroy(): void {
    this._button.onClicked.clear();
  }

  getButton(): Button {
    return this._button;
  }
}

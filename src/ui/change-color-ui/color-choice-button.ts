import {
  Border,
  Color,
  ContentButton,
  LayoutBox,
  Widget,
} from "@tabletop-playground/api";
import { ColorLib } from "ttpg-darrell";

import { CONFIG } from "../config/config";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

export class ColorChoiceButton extends AbstractUI {
  private readonly _contentButton: ContentButton;

  constructor(colorHex: string, scale: number) {
    const border: Border = new Border();
    const contentButton: ContentButton = new ContentButton().setChild(border);
    const widget: Widget = new LayoutBox()
      .setPadding(-4, -4, -4, -4)
      .setChild(contentButton);
    const size: UI_SIZE = {
      w: CONFIG.BUTTON_HEIGHT * scale, // square
      h: CONFIG.BUTTON_HEIGHT * scale,
    };
    super(widget, size);

    const color: Color = new ColorLib().parseColorOrThrow(colorHex);
    border.setColor(color);

    this._contentButton = contentButton;
  }

  getContentButton(): ContentButton {
    return this._contentButton;
  }
}

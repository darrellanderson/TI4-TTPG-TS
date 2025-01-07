import {
  Border,
  Canvas,
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
    const size: UI_SIZE = {
      w: CONFIG.BUTTON_HEIGHT * scale, // square
      h: CONFIG.BUTTON_HEIGHT * scale,
    };

    const border: Border = new Border();
    const borderBox: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(border);

    const contentButton: ContentButton = new ContentButton().setChild(
      borderBox
    );
    const contentButtonCanvas: Widget = new Canvas().addChild(
      contentButton,
      -4,
      -4,
      size.w + 8,
      size.h + 8
    );
    const contentButtonBox: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(contentButtonCanvas);

    super(contentButtonBox, size);

    const color: Color = new ColorLib().parseColorOrThrow(colorHex);
    border.setColor(color);

    this._contentButton = contentButton;
  }

  getContentButton(): ContentButton {
    return this._contentButton;
  }
}

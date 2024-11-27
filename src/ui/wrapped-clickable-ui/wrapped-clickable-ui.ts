import {
  Border,
  ContentButton,
  LayoutBox,
  Widget,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

export const BORDER_SIZE: number = 4;

export class WrappedClickableUI extends AbstractUI {
  private readonly _contentButton: ContentButton;
  private readonly _border: Border = new Border();

  constructor(ui: AbstractUI, scale: number) {
    const size: UI_SIZE = ui.getSize();
    size.w += BORDER_SIZE * 2 * scale;
    size.h += BORDER_SIZE * 2 * scale;

    const child: Widget = ui.getWidget();
    const contentButton: ContentButton = new ContentButton().setChild(child);
    const border = new Border().setChild(contentButton);

    const widget: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(border);

    super(widget, size);
    this._contentButton = contentButton;
    this._border = border;
  }
}

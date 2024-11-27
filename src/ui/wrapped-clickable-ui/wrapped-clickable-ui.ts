import { Border, LayoutBox, Widget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

const BORDER_SIZE: number = 4;

export class WrappedClickableUI extends AbstractUI {
  private readonly _ui: AbstractUI;
  private readonly _border: Border = new Border();

  constructor(ui: AbstractUI) {
    const size: UI_SIZE = ui.getSize();
    super({ w: size.w + BORDER_SIZE * 2, h: size.h + BORDER_SIZE * 2 });
    this._ui = ui;
  }

  getWidget(): Widget {
    const child: Widget = this._ui.getWidget();
    this._border.setChild(child);

    return new LayoutBox()
      .setOverrideWidth(this._width)
      .setOverrideHeight(this._height)
      .setChild(this._border);
  }
}

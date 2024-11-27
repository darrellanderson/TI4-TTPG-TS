import { Border, LayoutBox, Widget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

const BORDER_SIZE: number = 4;

export class WrappedClickableUI extends AbstractUI {
  private readonly _border: Border = new Border();

  constructor(ui: AbstractUI) {
    const size: UI_SIZE = ui.getSize();
    const child: Widget = ui.getWidget();
    const border = new Border().setChild(child);

    const widget: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(border);

    super(widget, { w: size.w + BORDER_SIZE * 2, h: size.h + BORDER_SIZE * 2 });
  }
}

import { Border, LayoutBox, Widget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { CONFIG } from "../../config/config";

export class AgendaHowToUI extends AbstractUI {
  constructor(scale: number) {
    const size: UI_SIZE = {
      w: CONFIG.BUTTON_WIDTH * 5 * scale + CONFIG.SPACING * 4 * scale,
      h: CONFIG.BUTTON_HEIGHT * 2 * scale + CONFIG.SPACING * 1 * scale,
    };
    const box: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setPadding(
        CONFIG.SPACING * scale,
        CONFIG.SPACING * scale,
        CONFIG.SPACING * scale,
        CONFIG.SPACING * scale
      );
    const widget: Widget = new Border().setColor([1, 0, 0, 1]).setChild(box);

    super(widget, size);
  }
}

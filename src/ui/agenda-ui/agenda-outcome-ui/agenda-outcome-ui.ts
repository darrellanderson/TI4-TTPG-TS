import { Canvas, LayoutBox, Widget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";

export class AgendaOutcomeUI extends AbstractUI {
  constructor(scale: number) {
    const size: UI_SIZE = { w: 100 * scale, h: 100 * scale };
    const widget: Widget = new Canvas();

    const box: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(widget);
    super(box, size);
  }
}

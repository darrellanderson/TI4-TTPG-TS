import { Canvas, LayoutBox, Widget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";

/**
 * UI:
 * - Outcome name (Text and EditText in a WidgetSwitcher).
 * - Total votes (Text).
 * - Per-player votes (Text).
 * - Riders (Button, show zoomed rider on click).
 */
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

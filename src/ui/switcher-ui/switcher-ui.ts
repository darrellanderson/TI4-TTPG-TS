import { Widget, WidgetSwitcher } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../ui/abstract-ui/abtract-ui";

export class SwitcherUI extends AbstractUI {
  private readonly _switcher: WidgetSwitcher = new WidgetSwitcher();

  constructor(uis: Array<AbstractUI>) {
    const switcher = new WidgetSwitcher();
    const size: UI_SIZE = { w: 0, h: 0 };
    for (const ui of uis) {
      const candidateSize: UI_SIZE = ui.getSize();
      size.w = Math.max(size.w, candidateSize.w);
      size.h = Math.max(size.h, candidateSize.h);

      const widget: Widget = ui.getWidget();
      switcher.addChild(widget);
    }

    super(switcher, size);
    this._switcher = switcher;
  }

  public switchToIndex(index: number): void {
    this._switcher.setActiveIndex(index);
  }
}

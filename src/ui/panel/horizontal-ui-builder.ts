import { Canvas, LayoutBox, Widget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

/**
 * Entries can be of varying sizes, aligned to top.
 */
export class HorizontalUIBuilder {
  private readonly _uis: Array<AbstractUI> = [];
  private _padding: number = 0;
  private _spacing: number = 0;

  addUIs(uis: Array<AbstractUI>): HorizontalUIBuilder {
    this._uis.push(...uis);
    return this;
  }

  setPadding(padding: number): HorizontalUIBuilder {
    this._padding = padding;
    return this;
  }

  setSpacing(spacing: number): HorizontalUIBuilder {
    this._spacing = spacing;
    return this;
  }

  build(): AbstractUI {
    // Calculate size while laying out entries.
    let nextX = this._padding;
    let maxHeight = 0;

    const canvas: Canvas = new Canvas();
    this._uis.forEach((entry: AbstractUI, index: number) => {
      const entrySize: UI_SIZE = entry.getSize();
      if (index > 0) {
        nextX += this._spacing;
      }
      maxHeight = Math.max(maxHeight, entrySize.h);

      canvas.addChild(
        entry.getWidget(),
        nextX,
        this._padding,
        entrySize.w,
        entrySize.h
      );

      nextX += entrySize.w;
    });
    const panelSize: UI_SIZE = {
      w: nextX + this._padding,
      h: maxHeight + this._padding * 2,
    };

    const canvasBox: Widget = new LayoutBox()
      .setOverrideWidth(panelSize.w)
      .setOverrideHeight(panelSize.h)
      .setChild(canvas);
    return new (class HorizontalUI extends AbstractUI {
      constructor() {
        super(canvasBox, panelSize);
      }
    })();
  }
}

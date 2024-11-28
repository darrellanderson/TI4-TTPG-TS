import { Canvas, LayoutBox, Widget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

/**
 * Entries can be of varying sizes, aligned to left.
 */
export class VerticalUIBuilder {
  private readonly _uis: Array<AbstractUI> = [];
  private _padding: number = 0;
  private _spacing: number = 0;

  addUIs(uis: Array<AbstractUI>): VerticalUIBuilder {
    this._uis.push(...uis);
    return this;
  }

  setPadding(padding: number): VerticalUIBuilder {
    this._padding = padding;
    return this;
  }

  setSpacing(spacing: number): VerticalUIBuilder {
    this._spacing = spacing;
    return this;
  }

  build(): AbstractUI {
    // Calculate size while laying out entries.
    let nextY = this._padding;
    let maxWidth = 0;

    const canvas: Canvas = new Canvas();
    this._uis.forEach((entry: AbstractUI, index: number) => {
      const entrySize: UI_SIZE = entry.getSize();
      if (index > 0) {
        nextY += this._spacing;
      }
      maxWidth = Math.max(maxWidth, entrySize.w);

      canvas.addChild(
        entry.getWidget(),
        this._padding,
        nextY,
        entrySize.w,
        entrySize.h
      );

      nextY += entrySize.h;
    });
    const panelSize: UI_SIZE = {
      w: maxWidth + this._padding * 2,
      h: nextY + this._padding,
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

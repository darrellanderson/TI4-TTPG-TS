import { Canvas, LayoutBox, Widget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

/**
 * Requires all entries be the same size.
 */
export class GridUIBuilder {
  private readonly _uis: Array<AbstractUI> = [];
  private _maxRows: number = 1;
  private _padding: number = 0;
  private _spacing: number = 0;

  addUIs(uis: Array<AbstractUI>): this {
    this._uis.push(...uis);
    return this;
  }

  setMaxRows(maxRows: number): this {
    this._maxRows = maxRows;
    return this;
  }

  setPadding(padding: number): this {
    this._padding = padding;
    return this;
  }

  setSpacing(spacing: number): this {
    this._spacing = spacing;
    return this;
  }

  build(): AbstractUI {
    const numCols: number = Math.ceil(this._uis.length / this._maxRows);
    const numRows: number = Math.min(this._maxRows, this._uis.length);

    let entrySize: UI_SIZE = { w: 0, h: 0 };
    const entry: AbstractUI | undefined = this._uis[0];
    if (entry) {
      entrySize = entry.getSize();
    }
    const gridSize: UI_SIZE = {
      w:
        entrySize.w * numCols +
        this._spacing * (numCols - 1) +
        this._padding * 2,
      h:
        entrySize.h * numRows +
        this._spacing * (numRows - 1) +
        this._padding * 2,
    };

    const canvas: Canvas = new Canvas();
    const canvasBox: Widget = new LayoutBox()
      .setOverrideWidth(gridSize.w)
      .setOverrideHeight(gridSize.h)
      .setChild(canvas);
    this._uis.forEach((entry: AbstractUI, index: number) => {
      const col: number = index % numCols;
      const row: number = Math.floor(index / numCols);
      const entrySize: UI_SIZE = entry.getSize();
      const x: number = col * (entrySize.w + this._spacing) + this._padding;
      const y: number = row * (entrySize.h + this._spacing) + this._padding;
      canvas.addChild(entry.getWidget(), x, y, entrySize.w, entrySize.h);
    });

    return new (class GridUI extends AbstractUI {
      constructor() {
        super(canvasBox, gridSize);
      }
    })();
  }
}

import { AbstractUI } from "../abstract-ui/abtract-ui";
import { VerticalUIBuilder } from "./vertical-ui-builder";
import { HorizontalUIBuilder } from "./horizontal-ui-builder";

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

    const rows: Array<HorizontalUIBuilder> = [];

    this._uis.forEach((entry: AbstractUI, index: number) => {
      const col: number = index % numCols;
      let currentRow: HorizontalUIBuilder | undefined = rows[rows.length - 1];
      if (currentRow === undefined || col === 0) {
        currentRow = new HorizontalUIBuilder().setSpacing(this._spacing);
        rows.push(currentRow);
      }
      currentRow.addUIs([entry]);
    });

    const rowAsUis: Array<AbstractUI> = rows.map((row: HorizontalUIBuilder) =>
      row.build()
    );
    return new VerticalUIBuilder()
      .setPadding(this._padding)
      .setSpacing(this._spacing)
      .addUIs(rowAsUis)
      .build();
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridUIBuilder = void 0;
const vertical_ui_builder_1 = require("./vertical-ui-builder");
const horizontal_ui_builder_1 = require("./horizontal-ui-builder");
/**
 * Requires all entries be the same size.
 */
class GridUIBuilder {
    constructor() {
        this._uis = [];
        this._maxRows = 1;
        this._padding = 0;
        this._spacing = 0;
    }
    addUIs(uis) {
        this._uis.push(...uis);
        return this;
    }
    setMaxRows(maxRows) {
        this._maxRows = maxRows;
        return this;
    }
    setPadding(padding) {
        this._padding = padding;
        return this;
    }
    setSpacing(spacing) {
        this._spacing = spacing;
        return this;
    }
    build() {
        const numCols = Math.ceil(this._uis.length / this._maxRows);
        const rows = [];
        this._uis.forEach((entry, index) => {
            const col = index % numCols;
            let currentRow = rows[rows.length - 1];
            if (currentRow === undefined || col === 0) {
                currentRow = new horizontal_ui_builder_1.HorizontalUIBuilder();
                rows.push(currentRow);
            }
            currentRow.addUIs([entry]);
        });
        const rowAsUis = rows.map((row) => row.setSpacing(this._spacing).build());
        return new vertical_ui_builder_1.VerticalUIBuilder()
            .setPadding(this._padding)
            .setSpacing(this._spacing)
            .addUIs(rowAsUis)
            .build();
    }
}
exports.GridUIBuilder = GridUIBuilder;
//# sourceMappingURL=grid-ui-builder.js.map
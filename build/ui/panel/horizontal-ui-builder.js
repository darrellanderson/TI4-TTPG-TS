"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorizontalUIBuilder = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
/**
 * Entries can be of varying sizes, aligned to top.
 */
class HorizontalUIBuilder {
    constructor() {
        this._uis = [];
        this._padding = 0;
        this._spacing = 0;
        this._verticalAlignment = api_1.VerticalAlignment.Top;
    }
    addUIs(uis) {
        this._uis.push(...uis);
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
    setVerticalAlignment(verticalAlignment) {
        this._verticalAlignment = verticalAlignment;
        return this;
    }
    build() {
        const panel = new api_1.HorizontalBox()
            .setChildDistance(this._spacing)
            .setVerticalAlignment(this._verticalAlignment);
        // Calculate size while adding out entries.
        let maxHeight = 0;
        let width = 0; // add padding later
        this._uis.forEach((entry, index) => {
            const entrySize = entry.getSize();
            maxHeight = Math.max(maxHeight, entrySize.h);
            if (index > 0) {
                width += this._spacing;
            }
            width += entrySize.w;
            panel.addChild(entry.getWidget());
        });
        const panelSize = {
            w: width + this._padding * 2,
            h: maxHeight + this._padding * 2,
        };
        // Place insize a "with padding" layout box.
        // Panels like to add scrollbars even with an exact fit,
        // set a negative excess padding to absorb extra.
        const panelBox = new api_1.LayoutBox()
            .setOverrideWidth(panelSize.w)
            .setOverrideHeight(panelSize.h)
            .setPadding(this._padding, -100, this._padding, 0)
            .setHorizontalAlignment(api_1.HorizontalAlignment.Left)
            .setVerticalAlignment(api_1.VerticalAlignment.Top)
            .setChild(panel);
        const uis = this._uis;
        return new (class HorizontalUI extends abtract_ui_1.AbstractUI {
            constructor() {
                super(panelBox, panelSize);
            }
            destroy() {
                uis.forEach((entry) => {
                    entry.destroy();
                });
                super.destroy();
            }
        })();
    }
}
exports.HorizontalUIBuilder = HorizontalUIBuilder;
//# sourceMappingURL=horizontal-ui-builder.js.map
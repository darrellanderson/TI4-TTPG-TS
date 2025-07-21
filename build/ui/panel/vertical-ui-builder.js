"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerticalUIBuilder = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
/**
 * Entries can be of varying sizes, aligned to left.
 */
class VerticalUIBuilder {
    constructor() {
        this._uis = [];
        this._horizontalAligntment = api_1.HorizontalAlignment.Left;
        this._padding = 0;
        this._spacing = 0;
        this._overrideHeight = -1;
    }
    addUIs(uis) {
        this._uis.push(...uis);
        return this;
    }
    setHorizontalAlignment(horizontalAlignment) {
        this._horizontalAligntment = horizontalAlignment;
        return this;
    }
    setOverrideHeight(overrideHeight) {
        this._overrideHeight = overrideHeight;
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
        const panel = new api_1.VerticalBox()
            .setChildDistance(this._spacing)
            .setHorizontalAlignment(this._horizontalAligntment);
        // Calculate size while adding entries.
        let maxWidth = 0;
        let height = 0; // add padding later
        this._uis.forEach((entry, index) => {
            const entrySize = entry.getSize();
            maxWidth = Math.max(maxWidth, entrySize.w);
            if (index > 0) {
                height += this._spacing;
            }
            height += entrySize.h;
            panel.addChild(entry.getWidget());
        });
        const panelSize = {
            w: maxWidth + this._padding * 2,
            h: height + this._padding * 2,
        };
        if (this._overrideHeight > 0) {
            panelSize.h = this._overrideHeight;
        }
        // Place insize a "with padding" layout box.
        // Panels like to add scrollbars even with an exact fit,
        // set a negative excess padding to absorb extra.
        const panelBox = new api_1.LayoutBox()
            .setOverrideWidth(panelSize.w)
            .setOverrideHeight(panelSize.h)
            .setPadding(this._padding, 0, this._padding, -100)
            .setHorizontalAlignment(api_1.HorizontalAlignment.Left)
            .setVerticalAlignment(api_1.VerticalAlignment.Top)
            .setChild(panel);
        if (this._overrideHeight > 0) {
            panelBox.setPadding(0, 0, 0, 0);
        }
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
exports.VerticalUIBuilder = VerticalUIBuilder;
//# sourceMappingURL=vertical-ui-builder.js.map
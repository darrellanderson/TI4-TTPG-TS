"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractUI = void 0;
const api_1 = require("@tabletop-playground/api");
/**
 * Represent a single UI widget.
 *
 * Needing everything at constructor time is a bit of a pain, but it's the best
 * way to ensure that the UI is immutable.
 */
class AbstractUI {
    constructor(widget, size) {
        this._width = 0;
        this._height = 0;
        // Place the widget inside a sized layout box, some widgets may render
        // incorrectly without this when used in a ContentButton (e.g. Canvas).
        // Also set h/v alignment to prevent the widget from stretching.
        this._widget = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setHorizontalAlignment(api_1.HorizontalAlignment.Left)
            .setVerticalAlignment(api_1.VerticalAlignment.Top)
            .setChild(widget);
        this._width = size.w;
        this._height = size.h;
    }
    /**
     * Remove any event handlers, etc.
     */
    destroy() { }
    getSize() {
        // Create a new tuple, prevent external modification.
        return { w: this._width, h: this._height };
    }
    getWidget() {
        return this._widget;
    }
}
exports.AbstractUI = AbstractUI;
//# sourceMappingURL=abtract-ui.js.map
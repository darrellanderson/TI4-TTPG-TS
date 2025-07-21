"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrappedClickableUI = exports.WRAPPED_BORDER_WIDTH = void 0;
const api_1 = require("@tabletop-playground/api");
const abstract_wrapped_clickable_ui_1 = require("./abstract-wrapped-clickable-ui");
exports.WRAPPED_BORDER_WIDTH = 4;
/**
 * Wrap an AbstractUI inside a ContentButton.
 */
class WrappedClickableUI extends abstract_wrapped_clickable_ui_1.AbstractWrappedClickableUI {
    constructor(ui, scale) {
        const borderWidth = exports.WRAPPED_BORDER_WIDTH * scale;
        // Add padding to inner UI before adding ContentButton.
        const innerSize = {
            w: ui.getSize().w + borderWidth * 2,
            h: ui.getSize().h + borderWidth * 2,
        };
        const innerBox = new api_1.LayoutBox()
            .setOverrideWidth(innerSize.w)
            .setOverrideHeight(innerSize.h)
            .setHorizontalAlignment(api_1.HorizontalAlignment.Center)
            .setVerticalAlignment(api_1.VerticalAlignment.Center)
            .setChild(ui.getWidget());
        // Place inner UI insdie a ContentButton.  ContentButton adds 4 px padding.
        const contentButtonSize = {
            w: innerSize.w + 8,
            h: innerSize.h + 8,
        };
        const contentButton = new api_1.ContentButton().setChild(innerBox);
        // Place inside an unsided LayoutBox with fixed padding.
        const borderSize = {
            w: contentButtonSize.w + borderWidth * 2,
            h: contentButtonSize.h + borderWidth * 2,
        };
        const contentButtonBox = new api_1.LayoutBox()
            .setPadding(borderWidth, borderWidth, borderWidth, borderWidth)
            .setChild(contentButton);
        const border = new api_1.Border().setChild(contentButtonBox);
        const borderBox = new api_1.LayoutBox()
            .setOverrideWidth(borderSize.w)
            .setOverrideHeight(borderSize.h)
            .setChild(border);
        super(borderBox, borderSize);
        this._border = new api_1.Border();
        this._innerUI = ui;
        this._contentButton = contentButton;
        this._border = border;
    }
    destroy() {
        this._innerUI.destroy();
        this._contentButton.onClicked.clear();
        super.destroy();
    }
    getContentButton() {
        return this._contentButton;
    }
    getBorder() {
        return this._border;
    }
}
exports.WrappedClickableUI = WrappedClickableUI;
//# sourceMappingURL=wrapped-clickable-ui.js.map
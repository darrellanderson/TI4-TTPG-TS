"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongRichTextUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const config_1 = require("../config/config");
class LongRichTextUI extends abtract_ui_1.AbstractUI {
    constructor(scaledWidth, scale) {
        const fontSize = config_1.CONFIG.FONT_SIZE * scale;
        const richText = new api_1.RichText()
            .setFontSize(fontSize)
            .setJustification(api_1.TextJustification.Center)
            .setText("X");
        const size = {
            w: scaledWidth,
            h: config_1.CONFIG.BUTTON_HEIGHT * scale,
        };
        const widget = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setHorizontalAlignment(api_1.HorizontalAlignment.Fill)
            .setVerticalAlignment(api_1.VerticalAlignment.Center)
            .setChild(richText);
        super(widget, size);
        this._richText = richText;
    }
    getRichText() {
        return this._richText;
    }
}
exports.LongRichTextUI = LongRichTextUI;
//# sourceMappingURL=long-richtext-ui.js.map
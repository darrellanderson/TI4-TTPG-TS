"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongLabelUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const config_1 = require("../config/config");
class LongLabelUI extends abtract_ui_1.AbstractUI {
    constructor(scaledWidth, scale) {
        const fontSize = config_1.CONFIG.FONT_SIZE * scale;
        const text = new api_1.Text()
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
            .setChild(text);
        super(widget, size);
        this._text = text;
    }
    getText() {
        return this._text;
    }
}
exports.LongLabelUI = LongLabelUI;
//# sourceMappingURL=long-label-ui.js.map
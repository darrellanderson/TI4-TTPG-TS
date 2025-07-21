"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckBoxUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const config_1 = require("../config/config");
class CheckBoxUI extends abtract_ui_1.AbstractUI {
    constructor(scale) {
        const fontSize = config_1.CONFIG.FONT_SIZE * scale;
        const checkBox = new api_1.CheckBox()
            .setFontSize(fontSize)
            .setText("X");
        const size = {
            w: config_1.CONFIG.BUTTON_WIDTH * scale,
            h: config_1.CONFIG.BUTTON_HEIGHT * scale,
        };
        const widget = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setHorizontalAlignment(api_1.HorizontalAlignment.Fill)
            .setVerticalAlignment(api_1.VerticalAlignment.Fill)
            .setChild(checkBox);
        super(widget, size);
        this._checkBox = checkBox;
    }
    destroy() {
        this._checkBox.onCheckStateChanged.clear();
    }
    getCheckBox() {
        return this._checkBox;
    }
}
exports.CheckBoxUI = CheckBoxUI;
//# sourceMappingURL=checkbox-ui.js.map
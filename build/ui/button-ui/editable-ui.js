"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditableUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const config_1 = require("../config/config");
class EditableUI extends abtract_ui_1.AbstractUI {
    constructor(scale) {
        const fontSize = config_1.CONFIG.FONT_SIZE * scale;
        const editText = new api_1.TextBox().setFontSize(fontSize);
        const size = {
            w: config_1.CONFIG.BUTTON_WIDTH * scale,
            h: config_1.CONFIG.BUTTON_HEIGHT * scale,
        };
        const widget = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setHorizontalAlignment(api_1.HorizontalAlignment.Fill)
            .setVerticalAlignment(api_1.VerticalAlignment.Fill)
            .setChild(editText);
        super(widget, size);
        this._editText = editText;
    }
    getEditText() {
        return this._editText;
    }
}
exports.EditableUI = EditableUI;
//# sourceMappingURL=editable-ui.js.map
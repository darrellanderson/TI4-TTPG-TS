"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorChoiceButton = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const config_1 = require("../config/config");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
class ColorChoiceButton extends abtract_ui_1.AbstractUI {
    constructor(colorHex, scale) {
        const size = {
            w: config_1.CONFIG.BUTTON_HEIGHT * scale, // square
            h: config_1.CONFIG.BUTTON_HEIGHT * scale,
        };
        const border = new api_1.Border();
        const borderBox = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setChild(border);
        const contentButton = new api_1.ContentButton().setChild(borderBox);
        const contentButtonCanvas = new api_1.Canvas().addChild(contentButton, -4, -4, size.w + 8, size.h + 8);
        const contentButtonBox = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setChild(contentButtonCanvas);
        super(contentButtonBox, size);
        const color = new ttpg_darrell_1.ColorLib().parseColorOrThrow(colorHex);
        border.setColor(color);
        this._contentButton = contentButton;
    }
    getContentButton() {
        return this._contentButton;
    }
}
exports.ColorChoiceButton = ColorChoiceButton;
//# sourceMappingURL=color-choice-button.js.map
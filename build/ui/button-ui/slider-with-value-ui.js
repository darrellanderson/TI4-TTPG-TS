"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderWithValueUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const config_1 = require("../config/config");
class SliderWithValueUI extends abtract_ui_1.AbstractUI {
    constructor(scale) {
        const slider = new api_1.Slider()
            .setFontSize(config_1.CONFIG.FONT_SIZE * scale)
            .setTextBoxWidth(config_1.CONFIG.FONT_SIZE * scale * 4)
            .setStepSize(1)
            .setMaxValue(100);
        const size = {
            w: config_1.CONFIG.BUTTON_WIDTH * scale,
            h: config_1.CONFIG.BUTTON_HEIGHT * scale,
        };
        const box = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setChild(slider);
        super(box, size);
        this._slider = slider;
    }
    getSlider() {
        return this._slider;
    }
}
exports.SliderWithValueUI = SliderWithValueUI;
//# sourceMappingURL=slider-with-value-ui.js.map
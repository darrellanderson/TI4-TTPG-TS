"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoIconLabel = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const config_1 = require("../config/config");
class TwoIconLabel extends abtract_ui_1.AbstractUI {
    constructor(scale) {
        const size = {
            w: (config_1.CONFIG.BUTTON_WIDTH * 2 + config_1.CONFIG.SPACING) * scale,
            h: config_1.CONFIG.BUTTON_HEIGHT * scale,
        };
        const spacing = config_1.CONFIG.SPACING * scale;
        const d = size.h - spacing * 2;
        const icon1 = new api_1.ImageWidget().setImageSize(d, d);
        const icon2 = new api_1.ImageWidget().setImageSize(d, d);
        const label = new api_1.RichText().setFontSize(config_1.CONFIG.FONT_SIZE * scale);
        const panel = new api_1.HorizontalBox()
            .setChildDistance(spacing)
            .setVerticalAlignment(api_1.VerticalAlignment.Center)
            .addChild(icon1)
            .addChild(icon2)
            .addChild(label);
        const box = new api_1.LayoutBox()
            .setOverrideHeight(size.h)
            .setOverrideWidth(size.w)
            .setChild(panel);
        super(box, size);
        this._icon1 = icon1;
        this._icon2 = icon2;
        this._label = label;
    }
    setIcon1(image, packageId) {
        this._icon1.setImage(image, packageId);
        return this;
    }
    setIcon2(image, packageId) {
        this._icon2.setImage(image, packageId);
        return this;
    }
    setLabel(text) {
        this._label.setText(text);
        return this;
    }
}
exports.TwoIconLabel = TwoIconLabel;
//# sourceMappingURL=two-icon-label-ui.js.map
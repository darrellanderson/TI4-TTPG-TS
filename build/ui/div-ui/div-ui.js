"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
class DivUI extends abtract_ui_1.AbstractUI {
    constructor(scale, scaledLength, orientation) {
        const thickness = 2 * scale;
        const w = orientation === "horizontal" ? scaledLength : thickness;
        const h = orientation === "horizontal" ? thickness : scaledLength;
        const size = {
            w,
            h,
        };
        const border = new api_1.Border().setColor([0, 0, 0, 1]);
        const borderBox = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setChild(border);
        super(borderBox, size);
    }
}
exports.DivUI = DivUI;
//# sourceMappingURL=div-ui.js.map
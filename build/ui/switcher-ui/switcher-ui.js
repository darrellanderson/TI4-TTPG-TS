"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitcherUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../../ui/abstract-ui/abtract-ui");
class SwitcherUI extends abtract_ui_1.AbstractUI {
    constructor(uis) {
        const switcher = new api_1.WidgetSwitcher();
        const size = { w: 0, h: 0 };
        for (const ui of uis) {
            const candidateSize = ui.getSize();
            size.w = Math.max(size.w, candidateSize.w);
            size.h = Math.max(size.h, candidateSize.h);
            const widget = ui.getWidget();
            switcher.addChild(widget);
        }
        super(switcher, size);
        this._switcher = new api_1.WidgetSwitcher();
        this._switcher = switcher;
    }
    switchToIndex(index) {
        this._switcher.setActiveIndex(index);
    }
}
exports.SwitcherUI = SwitcherUI;
//# sourceMappingURL=switcher-ui.js.map
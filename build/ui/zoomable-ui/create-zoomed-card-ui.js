"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateZoomedCardUI = exports.ZoomedCardUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
class ZoomedCardUI extends abtract_ui_1.AbstractUI {
    constructor(card, scale) {
        const extraScale = 0.9;
        const size = {
            w: 500 * scale * extraScale,
            h: 750 * scale * extraScale,
        };
        const widget = new api_1.ImageWidget()
            .setImageSize(size.w, size.h)
            .setSourceCard(card);
        super(widget, size);
    }
}
exports.ZoomedCardUI = ZoomedCardUI;
/**
 * UI generator for a card.
 */
class CreateZoomedCardUI {
    constructor(card) {
        this._card = card;
    }
    get() {
        return (scale) => {
            return new ZoomedCardUI(this._card, scale);
        };
    }
}
exports.CreateZoomedCardUI = CreateZoomedCardUI;
//# sourceMappingURL=create-zoomed-card-ui.js.map
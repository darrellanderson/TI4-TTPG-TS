"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractWrappedClickableUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
/**
 * ContentButton based UI with a Border.  Border color is set based on
 * the owning player slot.
 */
class AbstractWrappedClickableUI extends abtract_ui_1.AbstractUI {
    constructor(widget, size) {
        super(widget, size);
        this._owningPlayerSlot = -1;
    }
    getOwningPlayerSlot() {
        return this._owningPlayerSlot;
    }
    setOwningPlayerSlot(owningPlayerSlot) {
        if (owningPlayerSlot === undefined) {
            owningPlayerSlot = -1;
        }
        this._owningPlayerSlot = owningPlayerSlot;
        let color = new api_1.Color(0, 0, 0, 1);
        if (owningPlayerSlot !== -1) {
            color = api_1.world.getSlotColor(owningPlayerSlot);
        }
        this.getBorder().setColor(color);
        return this;
    }
}
exports.AbstractWrappedClickableUI = AbstractWrappedClickableUI;
//# sourceMappingURL=abstract-wrapped-clickable-ui.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleCardAction = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleCardAction extends ttpg_darrell_1.SimpleCardGarbageHandler {
    constructor() {
        super();
        this.setCardNsidPrefix("card.action:")
            .setFaceUp(true)
            .setSnapPointTag("discard-action");
    }
}
exports.RecycleCardAction = RecycleCardAction;
//# sourceMappingURL=recycle-card-action.js.map
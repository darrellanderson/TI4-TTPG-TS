"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleCardEvent = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleCardEvent extends ttpg_darrell_1.SimpleCardGarbageHandler {
    constructor() {
        super();
        this.setCardNsidPrefix("card.event:")
            .setFaceUp(false)
            .setSnapPointTag("deck-event");
    }
}
exports.RecycleCardEvent = RecycleCardEvent;
//# sourceMappingURL=recycle-card-event.js.map
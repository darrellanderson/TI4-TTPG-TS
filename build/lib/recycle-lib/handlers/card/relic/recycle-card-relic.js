"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleCardRelic = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleCardRelic extends ttpg_darrell_1.SimpleCardGarbageHandler {
    constructor() {
        super();
        this.setCardNsidPrefix("card.relic:")
            .setFaceUp(false)
            .setShuffleAfterDiscard(true)
            .setSnapPointTag("deck-relic");
    }
}
exports.RecycleCardRelic = RecycleCardRelic;
//# sourceMappingURL=recycle-card-relic.js.map
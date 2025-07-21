"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleCardSecret = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleCardSecret extends ttpg_darrell_1.SimpleCardGarbageHandler {
    constructor() {
        super();
        this.setCardNsidPrefix("card.objective.secret:")
            .setSnapPointTag("deck-objective-secret")
            .setFaceUp(false)
            .setShuffleAfterDiscard(true);
    }
}
exports.RecycleCardSecret = RecycleCardSecret;
//# sourceMappingURL=recycle-card-secret.js.map
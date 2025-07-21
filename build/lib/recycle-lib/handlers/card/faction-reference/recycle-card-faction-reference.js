"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleCardFactionReference = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleCardFactionReference extends ttpg_darrell_1.SimpleCardGarbageHandler {
    constructor() {
        super();
        this.setCardNsidPrefix("card.faction-reference:")
            .setFaceUp(false)
            .setSnapPointTag("deck-faction-reference");
    }
}
exports.RecycleCardFactionReference = RecycleCardFactionReference;
//# sourceMappingURL=recycle-card-faction-reference.js.map
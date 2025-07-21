"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleCardExplorationCultural = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleCardExplorationCultural extends ttpg_darrell_1.SimpleCardGarbageHandler {
    constructor() {
        super();
        this.setCardNsidPrefix("card.exploration.cultural:")
            .setFaceUp(true)
            .setSnapPointTag("discard-exploration-cultural");
    }
}
exports.RecycleCardExplorationCultural = RecycleCardExplorationCultural;
//# sourceMappingURL=recycle-card-exploration-cultural.js.map
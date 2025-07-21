"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleCardExplorationFrontier = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleCardExplorationFrontier extends ttpg_darrell_1.SimpleCardGarbageHandler {
    constructor() {
        super();
        this.setCardNsidPrefix("card.exploration.frontier:")
            .setFaceUp(true)
            .setSnapPointTag("discard-exploration-frontier");
    }
}
exports.RecycleCardExplorationFrontier = RecycleCardExplorationFrontier;
//# sourceMappingURL=recycle-card-exploration-frontier.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleCardExplorationHazardous = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleCardExplorationHazardous extends ttpg_darrell_1.SimpleCardGarbageHandler {
    constructor() {
        super();
        this.setCardNsidPrefix("card.exploration.hazardous:")
            .setFaceUp(true)
            .setSnapPointTag("discard-exploration-hazardous");
    }
}
exports.RecycleCardExplorationHazardous = RecycleCardExplorationHazardous;
//# sourceMappingURL=recycle-card-exploration-hazardous.js.map
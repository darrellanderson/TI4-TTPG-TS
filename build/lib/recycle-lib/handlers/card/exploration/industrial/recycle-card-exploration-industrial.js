"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleCardExplorationIndustrial = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleCardExplorationIndustrial extends ttpg_darrell_1.SimpleCardGarbageHandler {
    constructor() {
        super();
        this.setCardNsidPrefix("card.exploration.industrial:")
            .setFaceUp(true)
            .setSnapPointTag("discard-exploration-industrial");
    }
}
exports.RecycleCardExplorationIndustrial = RecycleCardExplorationIndustrial;
//# sourceMappingURL=recycle-card-exploration-industrial.js.map
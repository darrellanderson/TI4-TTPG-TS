"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleCardObjectiveStage1 = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleCardObjectiveStage1 extends ttpg_darrell_1.SimpleCardGarbageHandler {
    constructor() {
        super();
        this.setCardNsidPrefix("card.objective.public-1:")
            .setFaceUp(false)
            .setSnapPointTag("deck-objective-1");
    }
}
exports.RecycleCardObjectiveStage1 = RecycleCardObjectiveStage1;
//# sourceMappingURL=recycle-card-objective-stage-1.js.map
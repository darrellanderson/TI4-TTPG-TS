"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleCardObjectiveStage2 = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleCardObjectiveStage2 extends ttpg_darrell_1.SimpleCardGarbageHandler {
    constructor() {
        super();
        this.setCardNsidPrefix("card.objective.public-2:")
            .setFaceUp(false)
            .setSnapPointTag("deck-objective-2");
    }
}
exports.RecycleCardObjectiveStage2 = RecycleCardObjectiveStage2;
//# sourceMappingURL=recycle-card-objective-stage-2.js.map
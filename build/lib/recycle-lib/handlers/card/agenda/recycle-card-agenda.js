"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleCardAgenda = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleCardAgenda extends ttpg_darrell_1.SimpleCardGarbageHandler {
    constructor() {
        super();
        this.setCardNsidPrefix("card.agenda:")
            .setFaceUp(true)
            .setSnapPointTag("discard-agenda");
    }
}
exports.RecycleCardAgenda = RecycleCardAgenda;
//# sourceMappingURL=recycle-card-agenda.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleTokenFrontier = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleTokenFrontier extends ttpg_darrell_1.GarbageHandler {
    canRecycle(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        return nsid === "token.attachment.system:pok/frontier";
    }
    recycle(obj) {
        ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(obj);
        return true;
    }
}
exports.RecycleTokenFrontier = RecycleTokenFrontier;
//# sourceMappingURL=recycle-token-frontier.js.map
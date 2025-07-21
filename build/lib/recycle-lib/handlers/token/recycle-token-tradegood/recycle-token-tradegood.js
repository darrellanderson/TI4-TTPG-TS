"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleTokenTradegood = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleTokenTradegood extends ttpg_darrell_1.GarbageHandler {
    canRecycle(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        return (nsid === "token:base/tradegood-commodity-1" ||
            nsid === "token:base/tradegood-commodity-3");
    }
    recycle(obj) {
        ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(obj);
        return true;
    }
}
exports.RecycleTokenTradegood = RecycleTokenTradegood;
//# sourceMappingURL=recycle-token-tradegood.js.map
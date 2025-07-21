"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleTokenFighter = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleTokenFighter extends ttpg_darrell_1.GarbageHandler {
    canRecycle(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        return nsid === "token:base/fighter-1" || nsid === "token:base/fighter-3";
    }
    recycle(obj) {
        ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(obj);
        return true;
    }
}
exports.RecycleTokenFighter = RecycleTokenFighter;
//# sourceMappingURL=recycle-token-fighter.js.map
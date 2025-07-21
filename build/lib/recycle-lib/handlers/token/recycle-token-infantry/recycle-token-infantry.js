"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleTokenInfantry = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleTokenInfantry extends ttpg_darrell_1.GarbageHandler {
    canRecycle(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        return nsid === "token:base/infantry-1" || nsid === "token:base/infantry-3";
    }
    recycle(obj) {
        ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(obj);
        return true;
    }
}
exports.RecycleTokenInfantry = RecycleTokenInfantry;
//# sourceMappingURL=recycle-token-infantry.js.map
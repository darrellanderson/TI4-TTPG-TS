"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleUnit = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleUnit extends ttpg_darrell_1.GarbageHandler {
    constructor() {
        super(...arguments);
        this._find = new ttpg_darrell_1.Find();
    }
    canRecycle(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        return nsid.startsWith("unit:");
    }
    recycle(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        const containerNsid = `container.${nsid}`;
        const playerSlot = obj.getOwningPlayerSlot();
        const skipContained = true;
        const container = this._find.findContainer(containerNsid, playerSlot, skipContained);
        if (!container) {
            return false;
        }
        const type = container.getType();
        if (type === 1 || type === 3) {
            // Infinite container (anonymous units).
            ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(obj);
            return true;
        }
        container.addObjects([obj]);
        return true;
    }
}
exports.RecycleUnit = RecycleUnit;
//# sourceMappingURL=recycle-unit.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleSystemTile = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleSystemTile extends ttpg_darrell_1.GarbageHandler {
    constructor() {
        super(...arguments);
        this._find = new ttpg_darrell_1.Find();
    }
    canRecycle(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        return nsid.startsWith("tile.system:");
    }
    recycle(obj) {
        const containerNsid = `container:base/systems`;
        const owner = undefined;
        const skipContained = true;
        const container = this._find.findContainer(containerNsid, owner, skipContained);
        if (container) {
            container.addObjects([obj]);
            return obj.getContainer() === container; // might be full
        }
        return false;
    }
}
exports.RecycleSystemTile = RecycleSystemTile;
//# sourceMappingURL=recycle-system-tile.js.map
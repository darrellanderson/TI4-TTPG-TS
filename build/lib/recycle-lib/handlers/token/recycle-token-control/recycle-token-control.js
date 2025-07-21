"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleTokenControl = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleTokenControl extends ttpg_darrell_1.GarbageHandler {
    constructor() {
        super(...arguments);
        this._find = new ttpg_darrell_1.Find();
    }
    canRecycle(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        return nsid.startsWith("token.control:");
    }
    recycle(obj) {
        const owner = obj.getOwningPlayerSlot();
        const containerNsid = `container.token.control:base/generic`;
        const skipContained = true;
        const container = this._find.findContainer(containerNsid, owner, skipContained);
        if (container) {
            container.addObjects([obj]);
            return obj.getContainer() === container; // might be full
        }
        return false;
    }
}
exports.RecycleTokenControl = RecycleTokenControl;
//# sourceMappingURL=recycle-token-control.js.map
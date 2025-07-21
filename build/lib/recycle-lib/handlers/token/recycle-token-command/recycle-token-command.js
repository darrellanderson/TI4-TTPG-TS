"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleTokenCommand = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleTokenCommand extends ttpg_darrell_1.GarbageHandler {
    constructor() {
        super(...arguments);
        this._find = new ttpg_darrell_1.Find();
    }
    canRecycle(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        return nsid.startsWith("token.command:");
    }
    recycle(obj) {
        const owner = obj.getOwningPlayerSlot();
        const containerNsid = `container.token.command:base/generic`;
        const skipContained = true;
        const container = this._find.findContainer(containerNsid, owner, skipContained);
        if (container) {
            container.addObjects([obj]);
            return obj.getContainer() === container; // might be full
        }
        return false;
    }
}
exports.RecycleTokenCommand = RecycleTokenCommand;
//# sourceMappingURL=recycle-token-command.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleTokenAttachment = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleTokenAttachment extends ttpg_darrell_1.GarbageHandler {
    constructor() {
        super();
        this._find = new ttpg_darrell_1.Find();
    }
    canRecycle(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        if (nsid === "token.attachment.system:pok/frontier") {
            return false; // custom recycler exists
        }
        return nsid.startsWith("token.attachment.");
    }
    recycle(obj) {
        const containerNsid = `container.token:base/attachment`;
        const playerSlot = undefined;
        const skipContained = true;
        const container = this._find.findContainer(containerNsid, playerSlot, skipContained);
        if (!container) {
            return false;
        }
        container.addObjects([obj]);
        return true;
    }
}
exports.RecycleTokenAttachment = RecycleTokenAttachment;
//# sourceMappingURL=recycle-token-attachment.js.map
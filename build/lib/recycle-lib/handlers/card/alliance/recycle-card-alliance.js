"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleCardAlliance = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleCardAlliance extends ttpg_darrell_1.GarbageHandler {
    constructor() {
        super();
        this._cardUtil = new ttpg_darrell_1.CardUtil();
    }
    canRecycle(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        return obj instanceof api_1.Card && nsid.startsWith("card.alliance:");
    }
    recycle(obj) {
        if (obj instanceof api_1.Card) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            const playerSlotToFaction = TI4.factionRegistry.getPlayerSlotToFaction();
            for (const [playerSlot, faction] of playerSlotToFaction) {
                const factionAllianceNsids = faction.getAllianceNsids();
                if (factionAllianceNsids.includes(nsid)) {
                    return this._cardUtil.dealToHolder(obj, playerSlot);
                }
            }
        }
        return false;
    }
}
exports.RecycleCardAlliance = RecycleCardAlliance;
//# sourceMappingURL=recycle-card-alliance.js.map
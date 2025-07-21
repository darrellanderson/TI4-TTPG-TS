"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleCardLeader = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleCardLeader extends ttpg_darrell_1.GarbageHandler {
    constructor() {
        super();
        this._cardUtil = new ttpg_darrell_1.CardUtil();
    }
    canRecycle(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        return obj instanceof api_1.Card && nsid.startsWith("card.leader.");
    }
    recycle(obj) {
        if (obj instanceof api_1.Card) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            const playerSlotToFaction = TI4.factionRegistry.getPlayerSlotToFaction();
            for (const [playerSlot, faction] of playerSlotToFaction) {
                const factionLeaderNsids = [
                    ...faction.getAgentNsids(),
                    ...faction.getCommanderNsids(),
                    ...faction.getHeroNsids(),
                ];
                for (const factionLeaderNsid of factionLeaderNsids) {
                    // Card may be ".omega" or some such, so check if prefix.
                    if (nsid.startsWith(factionLeaderNsid)) {
                        return this._cardUtil.dealToHolder(obj, playerSlot);
                    }
                }
            }
        }
        return false;
    }
}
exports.RecycleCardLeader = RecycleCardLeader;
//# sourceMappingURL=recycle-card-leader.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleCardPromissory = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleCardPromissory extends ttpg_darrell_1.GarbageHandler {
    constructor() {
        super();
        this._cardUtil = new ttpg_darrell_1.CardUtil();
    }
    canRecycle(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        return obj instanceof api_1.Card && nsid.startsWith("card.promissory");
    }
    recycle(obj) {
        if (obj instanceof api_1.Card) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            // Generic promissory are "card.promissory.<color>:" prefixed.
            const genericPrefix = "card.promissory.";
            if (nsid.startsWith(genericPrefix)) {
                const colorName = nsid
                    .substring(genericPrefix.length)
                    .split(":")[0];
                if (colorName) {
                    const playerSlots = TI4.playerSeats
                        .getAllSeats()
                        .map((seat) => seat.playerSlot);
                    for (const playerSlot of playerSlots) {
                        const seatColorName = TI4.playerColor.getSlotColorName(playerSlot);
                        if (colorName === seatColorName) {
                            return this._cardUtil.dealToHolder(obj, playerSlot);
                        }
                    }
                }
            }
            // Faction promissory.
            const playerSlotToFaction = TI4.factionRegistry.getPlayerSlotToFaction();
            for (const [playerSlot, faction] of playerSlotToFaction) {
                for (const factionPromissoryNsid of faction.getPromissoryNsids()) {
                    // Card may be ".omega" or some such, so check if prefix.
                    if (nsid.startsWith(factionPromissoryNsid)) {
                        return this._cardUtil.dealToHolder(obj, playerSlot);
                    }
                }
            }
        }
        return false;
    }
}
exports.RecycleCardPromissory = RecycleCardPromissory;
//# sourceMappingURL=recycle-card-promissory.js.map
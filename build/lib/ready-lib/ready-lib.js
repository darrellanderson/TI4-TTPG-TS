"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyLib = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class ReadyLib {
    constructor() {
        this._cardUtil = new ttpg_darrell_1.CardUtil();
        this._readyNsidPrefixes = [
            "card.leader.agent",
            "card.legendary-planet:",
            "card.planet:",
            "card.relic:",
            "card.technology",
            "unit:",
        ];
    }
    readyAll() {
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (ttpg_darrell_1.Facing.isFaceUp(obj)) {
                continue; // already face up
            }
            if (obj.isHeld()) {
                continue; // held
            }
            if (obj instanceof api_1.Card) {
                const rejectSnapPointTags = [];
                if (nsid.startsWith("card.legendary-planet:")) {
                    rejectSnapPointTags[0] = "deck-legendary-planet";
                }
                else if (nsid.startsWith("card.planet:")) {
                    rejectSnapPointTags[0] = "deck-planet";
                }
                else if (nsid.startsWith("card.relic:")) {
                    rejectSnapPointTags[0] = "deck-relic";
                }
                const allowFaceDown = true;
                const isLooseCard = this._cardUtil.isLooseCard(obj, allowFaceDown, rejectSnapPointTags);
                if (!isLooseCard || obj.getStackSize() > 1) {
                    continue; // in deck location and/or has multiple cards
                }
            }
            for (const prefix of this._readyNsidPrefixes) {
                if (nsid.startsWith(prefix)) {
                    obj.flipOrUpright();
                }
            }
        }
    }
}
exports.ReadyLib = ReadyLib;
//# sourceMappingURL=ready-lib.js.map
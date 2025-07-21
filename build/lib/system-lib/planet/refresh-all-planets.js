"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshAllPlanets = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class RefreshAllPlanets {
    constructor() {
        this._cardUtil = new ttpg_darrell_1.CardUtil();
    }
    _getSystemHexes() {
        const hexes = new Set();
        const skipContained = true;
        for (const system of TI4.systemRegistry.getAllSystemsWithObjs(skipContained)) {
            const pos = system.getObj().getPosition();
            const hex = TI4.hex.fromPosition(pos);
            hexes.add(hex);
        }
        return hexes;
    }
    /**
     * Refresh all planet cards that are not on a system hex or in a card holder.
     */
    refresh(alsoRefreshTechAgentRelic) {
        const systemHexes = this._getSystemHexes();
        const startsWithEntries = [
            "card.planet",
            "card.legendary-planet",
        ];
        if (alsoRefreshTechAgentRelic) {
            startsWithEntries.push("card.technology.");
            startsWithEntries.push("card.leader.agent:");
            startsWithEntries.push("card.relic:");
        }
        const skipContained = true;
        const allowFaceDown = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            if (obj instanceof api_1.Card) {
                const nsid = ttpg_darrell_1.NSID.get(obj);
                let shouldRefresh = false;
                for (const startsWith of startsWithEntries) {
                    if (nsid.startsWith(startsWith)) {
                        shouldRefresh = true;
                        break;
                    }
                }
                if (shouldRefresh &&
                    this._cardUtil.isLooseCard(obj, allowFaceDown) &&
                    !ttpg_darrell_1.Facing.isFaceUp(obj)) {
                    const pos = obj.getPosition();
                    const hex = TI4.hex.fromPosition(pos);
                    if (!systemHexes.has(hex)) {
                        obj.flipOrUpright();
                    }
                }
            }
        }
    }
}
exports.RefreshAllPlanets = RefreshAllPlanets;
//# sourceMappingURL=refresh-all-planets.js.map
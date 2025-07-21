"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPlanetCards = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class ResetPlanetCards {
    constructor() {
        this._cardUtil = new ttpg_darrell_1.CardUtil();
    }
    reset() {
        // Planet cards on system hexes remain.
        const systemHexes = new Set();
        for (const system of TI4.systemRegistry.getAllSystemsWithObjs()) {
            const obj = system.getObj();
            if (!obj.getContainer()) {
                const pos = obj.getPosition();
                const hex = TI4.hex.fromPosition(pos);
                systemHexes.add(hex);
            }
        }
        const skipContained = true;
        const allowFaceDown = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            const isCandidate = nsid.startsWith("card.planet:") ||
                nsid.startsWith("card.legendary-planet:");
            const pos = obj.getPosition();
            const hex = TI4.hex.fromPosition(pos);
            if (obj instanceof api_1.Card &&
                isCandidate &&
                this._cardUtil.isLooseCard(obj, allowFaceDown) &&
                !ttpg_darrell_1.Facing.isFaceUp(obj) &&
                !systemHexes.has(hex)) {
                obj.flipOrUpright();
            }
        }
    }
}
exports.ResetPlanetCards = ResetPlanetCards;
//# sourceMappingURL=reset-planet-cards.js.map
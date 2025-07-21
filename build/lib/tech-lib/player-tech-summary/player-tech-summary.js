"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerTechSummary = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class PlayerTechSummary {
    static _getOwnedTechs(playerSlot) {
        const cardUtil = new ttpg_darrell_1.CardUtil();
        const find = new ttpg_darrell_1.Find();
        // Get techs owned by the player.
        const techs = [];
        const skipContained = true;
        const allowFaceDown = false;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid.startsWith("card.technology.") &&
                cardUtil.isLooseCard(obj, allowFaceDown)) {
                const pos = obj.getPosition();
                const owner = find.closestOwnedCardHolderOwner(pos);
                if (owner === playerSlot) {
                    const tech = TI4.techRegistry.getByNsid(nsid);
                    if (tech) {
                        techs.push(tech);
                    }
                }
            }
        }
        return techs;
    }
    constructor(playerSlot) {
        var _a;
        this._cardUtil = new ttpg_darrell_1.CardUtil();
        this._find = new ttpg_darrell_1.Find();
        // Get all owned techs for the player.
        const techs = PlayerTechSummary._getOwnedTechs(playerSlot);
        const techNsids = techs.map((tech) => {
            return tech.getNsid();
        });
        this._ownedTechNsids = new Set(techNsids);
        this._techColorToOwnedCount = new Map();
        for (const tech of techs) {
            const color = tech.getColor();
            const count = (_a = this._techColorToOwnedCount.get(color)) !== null && _a !== void 0 ? _a : 0;
            this._techColorToOwnedCount.set(color, count + 1);
        }
    }
    isOwned(techNsid) {
        return this._ownedTechNsids.has(techNsid);
    }
    getOwnedCount(color) {
        var _a;
        return (_a = this._techColorToOwnedCount.get(color)) !== null && _a !== void 0 ? _a : 0;
    }
}
exports.PlayerTechSummary = PlayerTechSummary;
//# sourceMappingURL=player-tech-summary.js.map
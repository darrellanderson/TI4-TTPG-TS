"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapRemovePlanetCards = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class MapRemovePlanetCards {
    removePlanetCards() {
        // Get system hexes.
        const hexes = new Set();
        const skipContained = true;
        for (const system of TI4.systemRegistry.getAllSystemsWithObjs(skipContained)) {
            const pos = system.getObj().getPosition();
            const hex = TI4.hex.fromPosition(pos);
            hexes.add(hex);
        }
        // Look for planet cards on system hexes.
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid.startsWith("card.planet") ||
                nsid.startsWith("card.legendary-planet")) {
                const pos = obj.getPosition();
                const hex = TI4.hex.fromPosition(pos);
                if (obj instanceof api_1.Card && hexes.has(hex)) {
                    this._removePlanetCard(obj);
                }
            }
        }
    }
    _removePlanetCard(card) {
        const player = undefined;
        ttpg_darrell_1.GarbageContainer.tryRecycle(card, player);
    }
}
exports.MapRemovePlanetCards = MapRemovePlanetCards;
//# sourceMappingURL=map-remove-planet-cards.js.map
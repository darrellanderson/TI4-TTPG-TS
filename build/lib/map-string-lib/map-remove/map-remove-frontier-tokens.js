"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapRemoveFrontierTokens = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class MapRemoveFrontierTokens {
    removeFrontierTokens() {
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
            if (nsid === "token.attachment.system:pok/frontier") {
                const pos = obj.getPosition();
                const hex = TI4.hex.fromPosition(pos);
                if (hexes.has(hex)) {
                    this._removeFrontierToken(obj);
                }
            }
        }
    }
    _removeFrontierToken(obj) {
        const player = undefined;
        ttpg_darrell_1.GarbageContainer.tryRecycle(obj, player);
    }
}
exports.MapRemoveFrontierTokens = MapRemoveFrontierTokens;
//# sourceMappingURL=map-remove-frontier-tokens.js.map
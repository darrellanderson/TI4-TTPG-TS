"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapPlaceFrontierTokens = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class MapPlaceFrontierTokens {
    static _getZeroPlanetSystems() {
        const zeroPlanetSystems = [];
        const skipContained = true;
        for (const system of TI4.systemRegistry.getAllSystemsWithObjs(skipContained)) {
            if (system.getPlanets().length === 0) {
                zeroPlanetSystems.push(system);
            }
        }
        return zeroPlanetSystems;
    }
    static _placeFrontierToken(system) {
        const pos = system.getObj().getPosition().add([0, -2.5, 10]);
        const token = ttpg_darrell_1.Spawn.spawn("token.attachment.system:pok/frontier", pos);
        if (token) {
            token.snapToGround();
        }
    }
    placeFrontierTokens() {
        const zeroPlanetSystems = MapPlaceFrontierTokens._getZeroPlanetSystems();
        for (const system of zeroPlanetSystems) {
            MapPlaceFrontierTokens._placeFrontierToken(system);
        }
    }
}
exports.MapPlaceFrontierTokens = MapPlaceFrontierTokens;
//# sourceMappingURL=map-place-frontier-tokens.js.map
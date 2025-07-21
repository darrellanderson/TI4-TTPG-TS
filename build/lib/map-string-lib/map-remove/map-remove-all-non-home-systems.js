"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapRemoveAllNonHomeSystems = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const IGNORE_TILES = new Set([
    18, // mecatol rex
    82, // mallice
]);
class MapRemoveAllNonHomeSystems {
    removeAllNonHomeSystems() {
        const skipContained = true;
        const systems = TI4.systemRegistry.getAllSystemsWithObjs(skipContained);
        const player = undefined;
        for (const system of systems) {
            const tile = system.getSystemTileNumber();
            if (!system.isHome() && !IGNORE_TILES.has(tile)) {
                const obj = system.getObj();
                obj.setObjectType(api_1.ObjectType.Regular);
                ttpg_darrell_1.GarbageContainer.tryRecycle(obj, player);
            }
        }
    }
}
exports.MapRemoveAllNonHomeSystems = MapRemoveAllNonHomeSystems;
//# sourceMappingURL=map-remove-all-non-home-systems.js.map
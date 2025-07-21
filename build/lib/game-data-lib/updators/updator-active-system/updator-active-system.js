"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorActiveSystem = void 0;
const on_system_activated_1 = require("../../../../event/on-system-activated/on-system-activated");
class UpdatorActiveSystem {
    update(gameData) {
        const lastActivatedSystem = on_system_activated_1.OnSystemActivated.getLastActivatedSystem();
        if (lastActivatedSystem) {
            const activeSystem = {
                tile: lastActivatedSystem.getSystemTileNumber(),
                planets: lastActivatedSystem
                    .getPlanets()
                    .map((planet) => planet.getName()),
            };
            gameData.activeSystem = activeSystem;
        }
    }
}
exports.UpdatorActiveSystem = UpdatorActiveSystem;
//# sourceMappingURL=updator-active-system.js.map
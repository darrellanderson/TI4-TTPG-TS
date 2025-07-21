"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutCombatArena = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class LayoutCombatArena {
    constructor() {
        this._layout = new ttpg_darrell_1.LayoutObjects();
        const arena = ttpg_darrell_1.Spawn.spawnOrThrow("mat:base/combat-arena");
        this._layout.add(arena);
        this._layout.addAfterLayout(() => {
            arena.setObjectType(api_1.ObjectType.Ground);
        });
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutCombatArena = LayoutCombatArena;
//# sourceMappingURL=layout-combat-arena.js.map
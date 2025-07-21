"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumpadKeyLookMap = void 0;
// 6 (z+110)
const api_1 = require("@tabletop-playground/api");
class NumpadKeyLookMap {
    constructor(key) {
        this._onScriptButtonPressed = (player, index, ctrl, alt) => {
            // Our key?
            if (index !== this._key || ctrl || alt) {
                return;
            }
            const lookAt = new api_1.Vector(0, 0, api_1.world.getTableHeight());
            const lookFrom = lookAt.add([-10, 0, 110]);
            const rot = lookFrom.findLookAtRotation(lookAt);
            player.setPositionAndRotation(lookFrom, rot);
        };
        this._key = key;
        api_1.globalEvents.onScriptButtonPressed.add(this._onScriptButtonPressed);
    }
    destroy() {
        api_1.globalEvents.onScriptButtonPressed.remove(this._onScriptButtonPressed);
    }
}
exports.NumpadKeyLookMap = NumpadKeyLookMap;
//# sourceMappingURL=numpad-key-look-map.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumpadKeyLookActiveSystem = void 0;
// 5 (z+20)
const api_1 = require("@tabletop-playground/api");
const on_system_activated_1 = require("../../../event/on-system-activated/on-system-activated");
class NumpadKeyLookActiveSystem {
    constructor(key) {
        this._onScriptButtonPressed = (player, index, ctrl, alt) => {
            // Our key?
            if (index !== this._key || ctrl || alt) {
                return;
            }
            const activeSystem = on_system_activated_1.OnSystemActivated.getLastActivatedSystem();
            if (!activeSystem) {
                return;
            }
            const obj = activeSystem.getObj();
            const lookAt = obj.getPosition();
            lookAt.z = api_1.world.getTableHeight();
            const lookFrom = lookAt.add([-10, 0, 20]);
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
exports.NumpadKeyLookActiveSystem = NumpadKeyLookActiveSystem;
//# sourceMappingURL=numpad-key-look-active-system.js.map
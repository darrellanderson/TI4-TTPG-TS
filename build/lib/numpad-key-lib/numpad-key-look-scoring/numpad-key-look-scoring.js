"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumpadKeyLookScoring = void 0;
// 7
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class NumpadKeyLookScoring {
    constructor(key) {
        this._find = new ttpg_darrell_1.Find();
        this._onScriptButtonPressed = (player, index, ctrl, alt) => {
            // Our key?
            if (index !== this._key || ctrl || alt) {
                return;
            }
            const skipContained = true;
            const obj = this._find.findGameObject("token:base/scoreboard", undefined, skipContained);
            if (!obj) {
                return;
            }
            const lookAt = obj.getPosition().add([-13, 0, 0]);
            lookAt.z = api_1.world.getTableHeight();
            const lookFrom = lookAt.add([-10, 0, 60]);
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
exports.NumpadKeyLookScoring = NumpadKeyLookScoring;
//# sourceMappingURL=numpad-key-look-scoring.js.map
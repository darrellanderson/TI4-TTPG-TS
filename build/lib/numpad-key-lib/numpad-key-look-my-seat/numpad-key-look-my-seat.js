"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumpadKeyLookMySeat = void 0;
// 9 (z+70)
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class NumpadKeyLookMySeat {
    constructor(key) {
        this._find = new ttpg_darrell_1.Find();
        this._onScriptButtonPressed = (player, index, ctrl, alt) => {
            // Our key?
            if (index !== this._key || ctrl || alt) {
                return;
            }
            const skipContained = true;
            const cardHolder = this._find.findCardHolder("card-holder:base/player-hand", player.getSlot(), skipContained);
            if (!cardHolder) {
                return;
            }
            const lookAt = cardHolder.getPosition();
            lookAt.x = lookAt.x * 0.7; // move towards center
            lookAt.z = api_1.world.getTableHeight();
            const lookFrom = lookAt.add([-10, 0, 70]);
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
exports.NumpadKeyLookMySeat = NumpadKeyLookMySeat;
//# sourceMappingURL=numpad-key-look-my-seat.js.map
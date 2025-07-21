"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumpadKeyLookSeat = void 0;
const api_1 = require("@tabletop-playground/api");
class NumpadKeyLookSeat {
    constructor() {
        this._onScriptButtonPressed = (player, index, ctrl, alt) => {
            // Our key?
            if (!ctrl || alt) {
                return;
            }
            const seats = TI4.playerSeats.getAllSeats();
            const seat = seats[index - 1];
            if (!seat) {
                return;
            }
            const lookAt = seat.cardHolder.getPosition();
            lookAt.x = lookAt.x * 0.7; // move towards center
            lookAt.z = api_1.world.getTableHeight();
            const lookFrom = lookAt.add([-10, 0, 70]);
            const rot = lookFrom.findLookAtRotation(lookAt);
            player.setPositionAndRotation(lookFrom, rot);
        };
        api_1.globalEvents.onScriptButtonPressed.add(this._onScriptButtonPressed);
    }
    destroy() {
        api_1.globalEvents.onScriptButtonPressed.remove(this._onScriptButtonPressed);
    }
}
exports.NumpadKeyLookSeat = NumpadKeyLookSeat;
//# sourceMappingURL=numpad-key-look-seat.js.map
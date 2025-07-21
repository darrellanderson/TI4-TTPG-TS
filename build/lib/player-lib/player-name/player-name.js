"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerName = void 0;
const api_1 = require("@tabletop-playground/api");
/**
 * Use a consistent player name.
 */
class PlayerName {
    getByPlayer(player) {
        return this.getBySlot(player.getSlot());
    }
    getBySlot(playerSlot) {
        const colorName = TI4.playerColor.getSlotColorName(playerSlot);
        if (colorName) {
            return colorName;
        }
        const player = api_1.world.getPlayerBySlot(playerSlot);
        if (player) {
            return player.getName();
        }
        return "???";
    }
}
exports.PlayerName = PlayerName;
//# sourceMappingURL=player-name.js.map
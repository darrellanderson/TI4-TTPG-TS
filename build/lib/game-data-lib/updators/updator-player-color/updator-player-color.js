"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorPlayerColor = void 0;
class UpdatorPlayerColor {
    update(gameData) {
        gameData.players.forEach((playerData, seatIndex) => {
            const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
            const colorName = TI4.playerColor.getSlotColorNameOrThrow(playerSlot);
            playerData.color = colorName;
        });
    }
}
exports.UpdatorPlayerColor = UpdatorPlayerColor;
//# sourceMappingURL=updator-player-color.js.map
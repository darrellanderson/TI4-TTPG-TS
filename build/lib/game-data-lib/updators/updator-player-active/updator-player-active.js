"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorPlayerActive = void 0;
class UpdatorPlayerActive {
    update(gameData) {
        gameData.players.forEach((player, seatIndex) => {
            const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
            player.active = !TI4.turnOrder.getPassed(playerSlot);
        });
    }
}
exports.UpdatorPlayerActive = UpdatorPlayerActive;
//# sourceMappingURL=updator-player-active.js.map
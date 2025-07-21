"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorPlayerName = void 0;
const api_1 = require("@tabletop-playground/api");
class UpdatorPlayerName {
    update(gameData) {
        gameData.players.forEach((playerData, seatIndex) => {
            const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
            const player = api_1.world.getPlayerBySlot(playerSlot);
            playerData.steamName = player ? player.getName() : "";
        });
    }
}
exports.UpdatorPlayerName = UpdatorPlayerName;
//# sourceMappingURL=updator-player-name.js.map
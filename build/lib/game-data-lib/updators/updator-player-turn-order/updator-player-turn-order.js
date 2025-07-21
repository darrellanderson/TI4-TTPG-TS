"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorPlayerTurnOrder = void 0;
class UpdatorPlayerTurnOrder {
    update(gameData) {
        const turnOrder = TI4.turnOrder.getTurnOrder();
        gameData.players.forEach((player, seatIndex) => {
            const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
            const turnOrderIndex = turnOrder.indexOf(playerSlot);
            if (turnOrderIndex >= 0) {
                player.turnOrder = turnOrderIndex;
            }
        });
    }
}
exports.UpdatorPlayerTurnOrder = UpdatorPlayerTurnOrder;
//# sourceMappingURL=updator-player-turn-order.js.map
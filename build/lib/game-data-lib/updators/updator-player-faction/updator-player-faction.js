"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorPlayerFaction = void 0;
class UpdatorPlayerFaction {
    update(gameData) {
        // Set factionFull and factionShort for each player
        gameData.players.forEach((player, seatIndex) => {
            const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
            const faction = TI4.factionRegistry.getByPlayerSlot(playerSlot);
            if (faction) {
                player.factionFull = faction.getName();
                player.factionShort = faction.getAbbr().replace("'", "");
            }
            else {
                player.factionFull = "";
                player.factionShort = "";
            }
        });
    }
}
exports.UpdatorPlayerFaction = UpdatorPlayerFaction;
//# sourceMappingURL=updator-player-faction.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorPlayerCommandTokens = void 0;
const command_token_counter_1 = require("../../../command-token-lib/command-token-counter/command-token-counter");
class UpdatorPlayerCommandTokens {
    constructor() {
        this._commandTokenCounter = new command_token_counter_1.CommandTokenCounter();
    }
    update(gameData) {
        const playerSlotToCommandTokenCounts = this._commandTokenCounter.getPlayerSlotToCommandTokenCounts();
        gameData.players.forEach((player, seatIndex) => {
            const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
            const commandTokenCounts = playerSlotToCommandTokenCounts.get(playerSlot);
            if (commandTokenCounts) {
                player.commandTokens = {
                    tactics: commandTokenCounts.tactic.length,
                    fleet: commandTokenCounts.fleet.length,
                    strategy: commandTokenCounts.strategy.length,
                };
            }
            else {
                player.commandTokens = {
                    tactics: 0,
                    fleet: 0,
                    strategy: 0,
                };
            }
        });
    }
}
exports.UpdatorPlayerCommandTokens = UpdatorPlayerCommandTokens;
//# sourceMappingURL=updator-player-command-tokens.js.map
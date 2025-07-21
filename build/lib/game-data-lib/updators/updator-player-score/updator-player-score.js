"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorPlayerScore = void 0;
const scoreboard_1 = require("../../../score-lib/scoreboard/scoreboard");
class UpdatorPlayerScore {
    constructor() {
        this._scoreboard = new scoreboard_1.Scoreboard();
    }
    update(gameData) {
        const playerSlotToScore = this._scoreboard.getPlayerSlotToScore();
        gameData.players.forEach((playerData, seatIndex) => {
            const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
            const score = playerSlotToScore.get(playerSlot);
            playerData.score = score !== null && score !== void 0 ? score : 0;
        });
    }
}
exports.UpdatorPlayerScore = UpdatorPlayerScore;
//# sourceMappingURL=updator-player-score.js.map
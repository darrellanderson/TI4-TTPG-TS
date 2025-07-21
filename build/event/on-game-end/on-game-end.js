"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnGameEnd = void 0;
/**
 * Trigger the game end event when a player reaches the required score.
 * Only send it once.
 */
class OnGameEnd {
    constructor() {
        this._onGameData = (gameData) => {
            const scoreNeeded = TI4.config.gamePoints;
            gameData.players.forEach((player) => {
                if (player.score && player.score >= scoreNeeded) {
                    TI4.events.onGameData.remove(this._onGameData);
                    TI4.events.onGameEnd.trigger();
                    return;
                }
            });
        };
    }
    init() {
        TI4.events.onGameData.add(this._onGameData);
    }
}
exports.OnGameEnd = OnGameEnd;
//# sourceMappingURL=on-game-end.js.map
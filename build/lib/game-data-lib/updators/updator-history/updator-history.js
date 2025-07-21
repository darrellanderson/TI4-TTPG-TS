"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorHistory = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * Report a very minimal history of GameData per round.
 */
class UpdatorHistory {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
        this._registered = false;
        this._onGameData = (gameData) => {
            // Extract fields for history:
            // - color and score for the "tempo" streamer frame.
            const minimalGameData = {
                players: gameData.players.map((player) => {
                    return {
                        color: player.color,
                        score: player.score,
                    };
                }),
            };
            const minimalJson = JSON.stringify(minimalGameData);
            // Because this may grow over time, store it on a game object and not world.
            // Use the scoreboard.
            const nsid = "token:base/scoreboard";
            const owningPlayerSlot = undefined;
            const skipContained = true;
            const scoreboard = this._find.findGameObject(nsid, owningPlayerSlot, skipContained);
            // Update per-round history (each entry is limited to 1KB).
            const round = gameData.round;
            if (round && scoreboard) {
                const key = `history-${round}`;
                scoreboard.setSavedData(minimalJson, key);
            }
        };
    }
    init() {
        TI4.events.onGameData.add(this._onGameData);
    }
    update(gameData) {
        const history = [];
        // Look for per-round history stored on the scoreboard.
        const nsid = "token:base/scoreboard";
        const owningPlayerSlot = undefined;
        const skipContained = true;
        const scoreboard = this._find.findGameObject(nsid, owningPlayerSlot, skipContained);
        if (scoreboard) {
            for (let round = 1; round <= 10; round++) {
                const key = `history-${round}`;
                const json = scoreboard.getSavedData(key);
                if (json && json.length > 0) {
                    const roundGameData = JSON.parse(json);
                    history[round - 1] = roundGameData;
                }
            }
        }
        gameData.history = history;
    }
}
exports.UpdatorHistory = UpdatorHistory;
//# sourceMappingURL=updator-history.js.map
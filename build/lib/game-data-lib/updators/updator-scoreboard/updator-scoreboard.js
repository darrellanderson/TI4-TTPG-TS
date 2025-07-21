"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorScoreboard = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const scoreboard_1 = require("../../../score-lib/scoreboard/scoreboard");
class UpdatorScoreboard {
    constructor() {
        this._scoreboard = new scoreboard_1.Scoreboard();
    }
    update(gameData) {
        const scoreboardObj = this._scoreboard.getScoreboard();
        let faceUp = false;
        if (scoreboardObj && ttpg_darrell_1.Facing.isFaceUp(scoreboardObj)) {
            faceUp = true;
        }
        gameData.scoreboard = faceUp ? 10 : 14;
    }
}
exports.UpdatorScoreboard = UpdatorScoreboard;
//# sourceMappingURL=updator-scoreboard.js.map
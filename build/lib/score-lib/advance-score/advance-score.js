"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvanceScore = void 0;
const api_1 = require("@tabletop-playground/api");
const scoreboard_1 = require("../scoreboard/scoreboard");
class AdvanceScore {
    constructor() {
        this._scoreboard = new scoreboard_1.Scoreboard();
    }
    addToScore(playerSlot, delta) {
        const token = this._scoreboard.getLeadControlToken(playerSlot);
        if (token) {
            const pos = token.getPosition();
            const score = this._scoreboard.posToScore(pos);
            if (score !== undefined) {
                const newScore = score + delta;
                const newPos = this._scoreboard.scoreToPos(newScore, playerSlot);
                if (newPos !== undefined) {
                    newPos.z = api_1.world.getTableHeight() + 10;
                    const animationSpeed = 1;
                    token.setPosition(newPos.add([0, 0, 1]), animationSpeed);
                    token.snapToGround();
                    return true;
                }
            }
        }
        return false;
    }
}
exports.AdvanceScore = AdvanceScore;
//# sourceMappingURL=advance-score.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const scoreboard_1 = require("./scoreboard");
const _scoreboardLib = new scoreboard_1.Scoreboard();
api_1.refObject.onReleased.add((obj) => {
    var _a, _b;
    const pos = obj.getPosition();
    const score = (_a = _scoreboardLib.posToScore(pos)) !== null && _a !== void 0 ? _a : -999;
    console.log(`score: ${score}`);
    const playerSlot = obj.getOwningPlayerSlot();
    const rev = (_b = _scoreboardLib.scoreToPos(score, playerSlot)) !== null && _b !== void 0 ? _b : new api_1.Vector(-999, -999, -999);
    const distance = pos.distance(rev);
    console.log(`distance: ${distance} (${rev.toString()})`);
    api_1.world.showPing(rev, [1, 0, 0, 1], false);
});
//# sourceMappingURL=scoreboard-control-token.testp.js.map
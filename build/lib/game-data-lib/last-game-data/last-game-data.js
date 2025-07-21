"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LastGameData = void 0;
class LastGameData {
    constructor() {
        this._gameData = undefined;
        this._onGameData = (gameData) => {
            this._gameData = gameData;
        };
    }
    init() {
        TI4.events.onGameData.add(this._onGameData);
    }
    destroy() {
        TI4.events.onGameData.remove(this._onGameData);
    }
    getLastGameData() {
        return this._gameData;
    }
}
exports.LastGameData = LastGameData;
//# sourceMappingURL=last-game-data.js.map
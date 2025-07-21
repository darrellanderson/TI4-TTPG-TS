"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameDataExport = void 0;
const api_1 = require("@tabletop-playground/api");
const EXPORT_INTERVAL_MSECS = 15 * 60 * 1000; // 15 minutes
/**
 * Send game data to AppEngine for stats.
 */
class GameDataExport {
    constructor() {
        this._onGameData = (gameData) => {
            if (this._sendNextGameData &&
                TI4.config.exportGameData &&
                TI4.config.timestamp > 0 &&
                api_1.world.getAllPlayers().length > 0) {
                this._sendNextGameData = false;
                this._send(gameData);
            }
        };
        this._onGameEnd = () => {
            this._sendNextGameData = true;
        };
        this._onInterval = () => {
            this._sendNextGameData = true;
        };
        this._sendNextGameData = false;
        this._intervalHandle = undefined;
    }
    init() {
        TI4.events.onGameData.add(this._onGameData);
        TI4.events.onGameEnd.add(this._onGameEnd);
        this._maybeStartInterval(api_1.GameWorld.getExecutionReason());
    }
    destroy() {
        TI4.events.onGameData.remove(this._onGameData);
        TI4.events.onGameEnd.remove(this._onGameEnd);
        if (this._intervalHandle) {
            clearInterval(this._intervalHandle);
            this._intervalHandle = undefined;
        }
    }
    _maybeStartInterval(executionReason) {
        if (executionReason !== "unittest") {
            this._intervalHandle = setInterval(this._onInterval, EXPORT_INTERVAL_MSECS);
        }
    }
    _send(gameData) {
        const json = JSON.stringify(gameData);
        const url = [
            "ti4-game-data.appspot.com",
            "/posttimestamp_ttpg",
            `?timestamp=${TI4.config.timestamp}`,
        ].join("");
        const fetchOptions = {
            headers: { "Content-type": "application/json;charset=UTF-8" },
            body: json,
            method: "POST",
        };
        fetch(url, fetchOptions);
    }
}
exports.GameDataExport = GameDataExport;
//# sourceMappingURL=game-data-export.js.map
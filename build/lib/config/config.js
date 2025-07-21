"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = exports.ConfigSchema = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const zod_1 = require("zod");
exports.ConfigSchema = zod_1.z
    .object({
    playerCount: zod_1.z.number().int().min(1).max(8),
    gamePoints: zod_1.z.number().int().min(8).max(14),
    timestamp: zod_1.z.number(), // game start Unix timestamp, seconds since epoch.
    sources: zod_1.z.array(zod_1.z.string()),
    exportGameData: zod_1.z.boolean(),
    reportErrors: zod_1.z.boolean(),
})
    .strict();
class Config {
    constructor(namespaceId) {
        this.onConfigChanged = new ttpg_darrell_1.TriggerableMulticastDelegate();
        this._namespaceId = namespaceId;
        const json = api_1.world.getSavedData(this._namespaceId);
        if (json && json.length > 0) {
            this._config = exports.ConfigSchema.parse(JSON.parse(json));
        }
        else {
            this._config = {
                playerCount: 6,
                gamePoints: 10,
                timestamp: 0,
                sources: [
                    "base",
                    "pok",
                    "codex.affinity",
                    "codex.ordinian",
                    "codex.vigil",
                    "codex.liberation",
                ],
                exportGameData: true,
                reportErrors: true,
            };
        }
    }
    _save() {
        const json = JSON.stringify(this._config, Object.keys(this._config).sort());
        api_1.world.setSavedData(json, this._namespaceId);
    }
    get playerCount() {
        return this._config.playerCount;
    }
    get gamePoints() {
        return this._config.gamePoints;
    }
    get sources() {
        return [...this._config.sources];
    }
    get timestamp() {
        return this._config.timestamp;
    }
    get exportGameData() {
        return this._config.exportGameData;
    }
    get reportErrors() {
        return this._config.reportErrors;
    }
    setPlayerCount(playerCount) {
        this._config.playerCount = playerCount;
        this._save();
        this.onConfigChanged.trigger(this);
        return this;
    }
    setGamePoints(gamePoints) {
        this._config.gamePoints = gamePoints;
        this._save();
        this.onConfigChanged.trigger(this);
        return this;
    }
    setSources(sources) {
        this._config.sources = sources;
        this._save();
        this.onConfigChanged.trigger(this);
        return this;
    }
    setTimestamp(timestamp) {
        this._config.timestamp = timestamp;
        this._save();
        this.onConfigChanged.trigger(this);
        return this;
    }
    setExportGameData(exportGameData) {
        this._config.exportGameData = exportGameData;
        this._save();
        this.onConfigChanged.trigger(this);
        return this;
    }
    setReportErrors(reportErrors) {
        this._config.reportErrors = reportErrors;
        this._save();
        this.onConfigChanged.trigger(this);
        return this;
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map
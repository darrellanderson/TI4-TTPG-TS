"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameDataUpdator = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const DELAY_BETWEEN_UPDATE_CYCLES_MSECS = 3000;
class GameDataUpdator {
    static createGameData() {
        const gameData = {
            players: [],
        };
        for (let i = 0; i < TI4.config.playerCount; i++) {
            gameData.players.push({});
        }
        return gameData;
    }
    constructor(updators) {
        this._gameData = undefined;
        this._nextProcessIndex = 0;
        this._intervalHandle = undefined;
        this._onInterval = () => {
            this._processNext();
        };
        this._updators = updators;
    }
    /**
     * Processes the next updator in the list.
     *
     * @returns true if all updators have been processed this cycle
     */
    _processNext() {
        if (!this._gameData) {
            this._gameData = GameDataUpdator.createGameData();
        }
        const updator = this._updators[this._nextProcessIndex];
        this._nextProcessIndex =
            (this._nextProcessIndex + 1) % this._updators.length;
        if (updator && this._gameData) {
            try {
                updator.update(this._gameData);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (error) {
                const stack = new Error(error).stack;
                if (stack) {
                    ttpg_darrell_1.ErrorHandler.onError.trigger(stack);
                }
            }
        }
        const finishedCycle = this._nextProcessIndex === 0;
        if (finishedCycle && this._gameData) {
            TI4.events.onGameData.trigger(this._gameData);
            this._gameData = undefined;
        }
        return finishedCycle;
    }
    startPeriodicUpdates() {
        if (this._intervalHandle) {
            clearInterval(this._intervalHandle);
            this._intervalHandle = undefined;
        }
        const intervalMsecs = Math.ceil(DELAY_BETWEEN_UPDATE_CYCLES_MSECS / (this._updators.length + 1) // in case zero
        );
        this._intervalHandle = setInterval(this._onInterval, intervalMsecs);
        return this;
    }
    stopPeriodicUpdates() {
        if (this._intervalHandle) {
            clearInterval(this._intervalHandle);
            this._intervalHandle = undefined;
        }
        return this;
    }
    startPeriodicUpdatesInProduction() {
        this.startPeriodicUpdates();
        if (api_1.GameWorld.getExecutionReason() === "unittest") {
            this.stopPeriodicUpdates();
        }
        return this;
    }
}
exports.GameDataUpdator = GameDataUpdator;
//# sourceMappingURL=game-data-updator.js.map
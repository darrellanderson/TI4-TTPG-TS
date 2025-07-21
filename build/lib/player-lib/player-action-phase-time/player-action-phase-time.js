"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerActionPhaseTime = void 0;
const api_1 = require("@tabletop-playground/api");
class PlayerActionPhaseTime {
    constructor(namespaceId) {
        this._intervalHandle = undefined;
        this._isActionPhase = false;
        this._round = 0;
        this._onGameData = (gameData) => {
            var _a;
            // If all players have srategy cards then we are in the action phase.
            let pickedStrategyCardsCount = 0;
            for (const player of gameData.players) {
                if (player.strategyCards) {
                    pickedStrategyCardsCount += player.strategyCards.length;
                }
            }
            const required = TI4.config.playerCount < 5
                ? TI4.config.playerCount * 2
                : TI4.config.playerCount;
            this._isActionPhase = pickedStrategyCardsCount >= required;
            this._round = (_a = gameData.round) !== null && _a !== void 0 ? _a : 0;
        };
        this._onInterval = () => {
            if (this.isActiveActionPhase()) {
                const activePlayerSlot = TI4.turnOrder.getCurrentTurn();
                const seatIndex = TI4.playerSeats.getSeatIndexByPlayerSlot(activePlayerSlot);
                if (seatIndex >= 0) {
                    this._incrSeconds(this._round, seatIndex, 1);
                }
            }
        };
        this._namespaceId = namespaceId;
        this._roundToSeatIndexToSeconds = this._load();
    }
    _save() {
        if (this._namespaceId) {
            const json = JSON.stringify(this._roundToSeatIndexToSeconds);
            api_1.world.setSavedData(json, this._namespaceId);
        }
    }
    _load() {
        let result = [];
        if (this._namespaceId) {
            const json = api_1.world.getSavedData(this._namespaceId);
            if (json && json.length > 0) {
                result = JSON.parse(json);
            }
        }
        return result;
    }
    _getSeatIndexToSeconds(round) {
        let seatIndexToSeconds = this._roundToSeatIndexToSeconds[round];
        if (seatIndexToSeconds === undefined) {
            seatIndexToSeconds = [];
            this._roundToSeatIndexToSeconds[round] = seatIndexToSeconds;
        }
        return seatIndexToSeconds;
    }
    _incrSeconds(round, seatIndex, incrBy) {
        const seatIndexToSeconds = this._getSeatIndexToSeconds(round);
        const seconds = this.getSeconds(round, seatIndex) + incrBy;
        seatIndexToSeconds[seatIndex] = seconds;
        this._save();
    }
    getSeconds(round, seatIndex) {
        const seatIndexToSeconds = this._getSeatIndexToSeconds(round);
        const seconds = seatIndexToSeconds[seatIndex];
        return seconds !== null && seconds !== void 0 ? seconds : 0;
    }
    init() {
        TI4.events.onGameData.add(this._onGameData);
        this._maybeStartInterval(api_1.GameWorld.getExecutionReason());
    }
    _maybeStartInterval(executionReason) {
        if (executionReason !== "unittest") {
            this._intervalHandle = setInterval(this._onInterval, 1000);
        }
    }
    destroy() {
        if (this._intervalHandle) {
            clearInterval(this._intervalHandle);
        }
        TI4.events.onGameData.remove(this._onGameData);
    }
    getRound() {
        return this._round;
    }
    isActiveActionPhase() {
        const isTimerActive = TI4.timer.export().active;
        return this._isActionPhase && isTimerActive;
    }
}
exports.PlayerActionPhaseTime = PlayerActionPhaseTime;
//# sourceMappingURL=player-action-phase-time.js.map
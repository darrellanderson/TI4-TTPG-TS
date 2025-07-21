"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyCardsState = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * Per-player set of active strategy cards, in order of play.
 */
class StrategyCardsState {
    static strategyCardToNumber(strategyCard) {
        const nsid = ttpg_darrell_1.NSID.get(strategyCard);
        const parsed = ttpg_darrell_1.NSID.parse(nsid);
        const firstNamePart = parsed === null || parsed === void 0 ? void 0 : parsed.nameParts[0];
        if (firstNamePart === "leadership") {
            return 1;
        }
        else if (firstNamePart === "diplomacy") {
            return 2;
        }
        else if (firstNamePart === "politics") {
            return 3;
        }
        else if (firstNamePart === "construction") {
            return 4;
        }
        else if (firstNamePart === "trade") {
            return 5;
        }
        else if (firstNamePart === "warfare") {
            return 6;
        }
        else if (firstNamePart === "technology") {
            return 7;
        }
        else if (firstNamePart === "imperial") {
            return 8;
        }
        return undefined;
    }
    constructor(persistenceKey) {
        this.onStrategyCardsStateChanged = new ttpg_darrell_1.TriggerableMulticastDelegate();
        this.onStrategyCardPlayedHandler = (strategyCard, player) => {
            const playingPlayerSlot = player.getSlot();
            const strategyCardNumber = StrategyCardsState.strategyCardToNumber(strategyCard);
            if (strategyCardNumber !== undefined) {
                this.setLastPlayerSlotPlayed(strategyCardNumber, playingPlayerSlot);
                for (const playerSeat of TI4.playerSeats.getAllSeats()) {
                    const playerSlot = playerSeat.playerSlot;
                    this.addOrUpdate(playerSlot, strategyCardNumber, "");
                }
            }
        };
        this._playerSlotToActive = new Map();
        this._strategyCardNumberToLastPlayerSlotPlayed = new Map();
        this._persistenceKey = persistenceKey;
        this._load();
        TI4.events.onStrategyCardPlayed.add(this.onStrategyCardPlayedHandler);
    }
    destroy() {
        TI4.events.onStrategyCardPlayed.remove(this.onStrategyCardPlayedHandler);
    }
    _save() {
        const packed = [];
        const strategyCardNumberAndLastPlayerSlotPlayed = [];
        for (const [strategyCardNumber, playerSlot] of this
            ._strategyCardNumberToLastPlayerSlotPlayed) {
            strategyCardNumberAndLastPlayerSlotPlayed.push(strategyCardNumber, playerSlot);
        }
        packed.push(strategyCardNumberAndLastPlayerSlotPlayed);
        // playerSlotToActive.
        for (const [playerSlot, active] of this._playerSlotToActive.entries()) {
            const packedEntry = [playerSlot];
            for (const activeEntry of active) {
                packedEntry.push(activeEntry.number, activeEntry.state);
            }
            packed.push(packedEntry);
        }
        const json = JSON.stringify(packed);
        api_1.world.setSavedData(json, this._persistenceKey);
    }
    _load() {
        this._strategyCardNumberToLastPlayerSlotPlayed.clear();
        this._playerSlotToActive.clear();
        const json = api_1.world.getSavedData(this._persistenceKey);
        if (json && json.length > 0) {
            const entries = JSON.parse(json);
            const strategyCardNumberAndLastPlayerSlotPlayed = entries.shift();
            while (strategyCardNumberAndLastPlayerSlotPlayed.length > 0) {
                const strategyCardNumber = strategyCardNumberAndLastPlayerSlotPlayed.shift();
                const playerSlot = strategyCardNumberAndLastPlayerSlotPlayed.shift();
                this._strategyCardNumberToLastPlayerSlotPlayed.set(strategyCardNumber, playerSlot);
            }
            for (const entry of entries) {
                const playerSlot = entry.shift();
                const active = this._getMutableActive(playerSlot);
                while (entry.length > 0) {
                    const number = entry.shift();
                    const state = entry.shift();
                    active.push({ number, state });
                }
            }
        }
    }
    _getMutableActive(playerSlot) {
        let active = this._playerSlotToActive.get(playerSlot);
        if (!active) {
            active = [];
            this._playerSlotToActive.set(playerSlot, active);
        }
        return active;
    }
    active(playerSlot) {
        const active = this._getMutableActive(playerSlot);
        return active.map((entry) => {
            // clone
            return {
                number: entry.number,
                state: entry.state,
            };
        });
    }
    addOrUpdate(playerSlot, strategyCardNumber, state) {
        const active = this._getMutableActive(playerSlot);
        let strategyCardNumberAndState = active.find((entry) => entry.number === strategyCardNumber);
        if (!strategyCardNumberAndState) {
            strategyCardNumberAndState = { number: strategyCardNumber, state };
            active.push(strategyCardNumberAndState);
        }
        else {
            strategyCardNumberAndState.state = state;
        }
        this._save();
        this.onStrategyCardsStateChanged.trigger();
        return this;
    }
    remove(playerSlot, strategyCardNumber) {
        const active = this._getMutableActive(playerSlot);
        const index = active.findIndex((entry) => entry.number === strategyCardNumber);
        if (index > -1) {
            active.splice(index, 1);
        }
        this._save();
        this.onStrategyCardsStateChanged.trigger();
        return this;
    }
    setLastPlayerSlotPlayed(strategyCardNumber, playerSlot) {
        this._strategyCardNumberToLastPlayerSlotPlayed.set(strategyCardNumber, playerSlot);
        this._save();
        this.onStrategyCardsStateChanged.trigger();
        return this;
    }
    getLastPlayerSlotPlayed(strategyCardNumber) {
        return this._strategyCardNumberToLastPlayerSlotPlayed.get(strategyCardNumber);
    }
}
exports.StrategyCardsState = StrategyCardsState;
//# sourceMappingURL=strategy-cards-state.js.map
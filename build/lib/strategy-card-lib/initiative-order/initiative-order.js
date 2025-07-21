"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitiativeOrder = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const player_seats_1 = require("../../player-lib/player-seats/player-seats");
const STRATEGY_CARD_TO_INITIATIVE = {
    leadership: 1,
    diplomacy: 2,
    politics: 3,
    construction: 4,
    trade: 5,
    warfare: 6,
    technology: 7,
    imperial: 8,
};
const OTHER_NSID_TO_INITIATIVE = {
    "token:base/naalu-zero": 0,
};
class InitiativeOrder {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
        this._playerSeats = new player_seats_1.PlayerSeats();
    }
    static getStrategyCardNsidNameFirst(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        if (nsid.startsWith("tile.strategy-card:")) {
            const parsed = ttpg_darrell_1.NSID.parse(nsid);
            if (parsed) {
                const nameFirst = parsed.nameParts[0];
                if (nameFirst !== undefined) {
                    if (nameFirst in STRATEGY_CARD_TO_INITIATIVE) {
                        return nameFirst;
                    }
                }
            }
        }
        return undefined;
    }
    _isAtopStrategyCardMat(strategyCard) {
        const mat = this._find.findGameObject("mat:base/strategy-card");
        if (mat) {
            const atop = new ttpg_darrell_1.Atop(mat);
            const pos = strategyCard.getPosition();
            return atop.isAtop(pos);
        }
        return false;
    }
    get() {
        const playerSlotToEntry = new Map();
        const addToEntry = (playerSlot, initiative, strategyCard) => {
            let entry = playerSlotToEntry.get(playerSlot);
            if (!entry) {
                entry = {
                    playerSlot,
                    initiative,
                    strategyCards: [],
                };
                playerSlotToEntry.set(playerSlot, entry);
            }
            entry.initiative = Math.min(entry.initiative, initiative);
            if (strategyCard) {
                entry.strategyCards.push(strategyCard);
            }
        };
        let initiative;
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            // Check if strategy card.
            const strategyCardNsidNameFirst = InitiativeOrder.getStrategyCardNsidNameFirst(obj);
            if (strategyCardNsidNameFirst) {
                initiative = STRATEGY_CARD_TO_INITIATIVE[strategyCardNsidNameFirst];
                if (initiative !== undefined) {
                    if (!this._isAtopStrategyCardMat(obj)) {
                        const pos = obj.getPosition();
                        const playerSlot = this._find.closestOwnedCardHolderOwner(pos);
                        addToEntry(playerSlot, initiative, obj);
                    }
                }
            }
            // Check if other.
            const nsid = ttpg_darrell_1.NSID.get(obj);
            initiative = OTHER_NSID_TO_INITIATIVE[nsid];
            if (initiative !== undefined) {
                const pos = obj.getPosition();
                const playerSlot = this._find.closestOwnedCardHolderOwner(pos);
                addToEntry(playerSlot, initiative, undefined);
            }
        }
        const result = [...playerSlotToEntry.values()];
        return result.sort((a, b) => a.initiative - b.initiative);
    }
    setTurnOrderFromStrategyCards() {
        const entries = this.get();
        const order = entries.map((entry) => entry.playerSlot);
        // Any missing player slots.
        const seats = this._playerSeats.getAllSeats();
        for (const seat of seats) {
            if (!order.includes(seat.playerSlot)) {
                order.push(seat.playerSlot);
            }
        }
        const direction = "forward";
        const currentTurn = order[0];
        if (currentTurn) {
            TI4.turnOrder.setTurnOrder(order, direction, currentTurn);
        }
    }
}
exports.InitiativeOrder = InitiativeOrder;
//# sourceMappingURL=initiative-order.js.map
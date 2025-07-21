"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorPlayerStrategyCards = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class UpdatorPlayerStrategyCards {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
    }
    update(gameData) {
        const matNsid = "mat:base/strategy-card";
        const owningPlayerSlot = undefined;
        const skipContained = true;
        const strategyCardMat = this._find.findGameObject(matNsid, owningPlayerSlot, skipContained);
        if (strategyCardMat === undefined) {
            return;
        }
        const atopStrategyCardMat = new ttpg_darrell_1.Atop(strategyCardMat);
        const playerSlotToStrategyCards = new Map();
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            const pos = obj.getPosition();
            if (nsid.startsWith("tile.strategy-card:") &&
                !atopStrategyCardMat.isAtop(pos)) {
                const playerSlot = this._find.closestOwnedCardHolderOwner(pos);
                let strategyCards = playerSlotToStrategyCards.get(playerSlot);
                if (strategyCards === undefined) {
                    strategyCards = [];
                    playerSlotToStrategyCards.set(playerSlot, strategyCards);
                }
                strategyCards.push(obj);
            }
        }
        gameData.players.forEach((player, seatIndex) => {
            var _a;
            const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
            const strategyCards = (_a = playerSlotToStrategyCards.get(playerSlot)) !== null && _a !== void 0 ? _a : [];
            player.strategyCards = strategyCards.map((obj) => {
                return obj.getName();
            });
            player.strategyCardsFaceDown = strategyCards
                .filter((obj) => {
                const isFaceUp = ttpg_darrell_1.Facing.isFaceUp(obj);
                return !isFaceUp;
            })
                .map((obj) => {
                return obj.getName();
            });
        });
    }
}
exports.UpdatorPlayerStrategyCards = UpdatorPlayerStrategyCards;
//# sourceMappingURL=updator-player-strategy-cards.js.map
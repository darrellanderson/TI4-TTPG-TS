"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorPlayerTradegoods = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class UpdatorPlayerTradegoods {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
    }
    update(gameData) {
        const skipContained = true;
        const owningPlayerSlot = undefined;
        // Ignore if on the strategy card mat.
        const strategyCardMat = this._find.findGameObject("mat:base/strategy-card", owningPlayerSlot, skipContained);
        let atopStrategyCardMat = undefined;
        if (strategyCardMat) {
            atopStrategyCardMat = new ttpg_darrell_1.Atop(strategyCardMat);
        }
        // Ignore if on artuno the betrayer (nomad agent).
        const artuno = this._find.findCard("card.leader.agent:pok/artuno-the-betrayer", owningPlayerSlot, skipContained);
        let atopArtuno = undefined;
        if (artuno) {
            atopArtuno = new ttpg_darrell_1.Atop(artuno);
        }
        // Get all tradegoods not atop the strategy card mat or artuno.
        const allTradegoods = [];
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid === "token:base/tradegood-commodity-1" ||
                nsid === "token:base/tradegood-commodity-3") {
                const pos = obj.getPosition();
                if (atopStrategyCardMat && atopStrategyCardMat.isAtop(pos)) {
                    continue;
                }
                if (atopArtuno && atopArtuno.isAtop(pos)) {
                    continue;
                }
                allTradegoods.push(obj);
            }
        }
        // Sort by closest player.
        const playerSlotToTradegoods = new Map();
        allTradegoods.forEach((obj) => {
            const pos = obj.getPosition();
            const playerSlot = this._find.closestOwnedCardHolderOwner(pos);
            let tradegoods = playerSlotToTradegoods.get(playerSlot);
            if (!tradegoods) {
                tradegoods = [];
                playerSlotToTradegoods.set(playerSlot, tradegoods);
            }
            tradegoods.push(obj);
        });
        gameData.players.forEach((player, seatIndex) => {
            var _a;
            let commodities = 0;
            let tradeGoods = 0;
            let maxCommodities = 0;
            // Count tradegoods/commodities.
            const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
            const tradegoods = (_a = playerSlotToTradegoods.get(playerSlot)) !== null && _a !== void 0 ? _a : [];
            tradegoods.forEach((obj) => {
                const nsid = ttpg_darrell_1.NSID.get(obj);
                let value = 0;
                if (nsid === "token:base/tradegood-commodity-1") {
                    value = 1;
                }
                else if (nsid === "token:base/tradegood-commodity-3") {
                    value = 3;
                }
                if (ttpg_darrell_1.Facing.isFaceUp(obj)) {
                    commodities += value;
                }
                else {
                    tradeGoods += value;
                }
            });
            // Get max commodities.
            const faction = TI4.factionRegistry.getByPlayerSlot(playerSlot);
            if (faction) {
                maxCommodities = faction.getCommodities();
            }
            player.commodities = commodities;
            player.tradeGoods = tradeGoods;
            player.maxCommodities = maxCommodities;
        });
    }
}
exports.UpdatorPlayerTradegoods = UpdatorPlayerTradegoods;
//# sourceMappingURL=updator-player-tradegoods.js.map
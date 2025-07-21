"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnStrategyCard = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const recycle_strategy_card_1 = require("../../recycle-lib/handlers/strategy-card/recycle-strategy-card");
class ReturnStrategyCard {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
        this._recycleStrateydCard = new recycle_strategy_card_1.RecycleStrategyCard();
    }
    returnAllStrategyCardsRespecingPoliticalStability() {
        // If a player has "political stability" they keep their strategy card.
        const strategyCards = [];
        let politicalStabilityOwner = -1;
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid === "card.action:base/political-stability") {
                const pos = obj.getPosition();
                politicalStabilityOwner = this._find.closestOwnedCardHolderOwner(pos);
            }
            else if (nsid.startsWith("tile.strategy-card:")) {
                strategyCards.push(obj);
            }
        }
        for (const obj of strategyCards) {
            const pos = obj.getPosition();
            const owner = this._find.closestOwnedCardHolderOwner(pos);
            if (owner !== politicalStabilityOwner &&
                this._recycleStrateydCard.canRecycle(obj)) {
                this._recycleStrateydCard.recycle(obj);
            }
        }
    }
}
exports.ReturnStrategyCard = ReturnStrategyCard;
//# sourceMappingURL=return-strategy-card.js.map
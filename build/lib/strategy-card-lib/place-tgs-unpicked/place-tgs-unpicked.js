"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceTgsUnpicked = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class PlaceTgsUnpicked {
    _getUnpickedStrategyCards() {
        const strategyCards = [];
        let strategyCardMat = undefined;
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid.startsWith("tile.strategy-card:")) {
                strategyCards.push(obj);
            }
            else if (nsid === "mat:base/strategy-card") {
                strategyCardMat = obj;
            }
        }
        if (!strategyCardMat) {
            return [];
        }
        const atop = new ttpg_darrell_1.Atop(strategyCardMat);
        return strategyCards.filter((strategyCard) => {
            const pos = strategyCard.getPosition();
            return atop.isAtop(pos);
        });
    }
    _placeTradeGood(strategyCard) {
        const noiseD = 1;
        const noise = new api_1.Vector(Math.random() * noiseD * 2 - noiseD, Math.random() * noiseD * 2 - noiseD, 5 // above
        );
        const pos = strategyCard.getPosition().add(noise);
        const rot = new api_1.Rotator(0, 0, 180);
        const tradeGood = ttpg_darrell_1.Spawn.spawn("token:base/tradegood-commodity-1", pos, rot);
        if (tradeGood) {
            tradeGood.snapToGround();
        }
        return tradeGood !== undefined;
    }
    placeTgsUnpicked() {
        // Gather relevant objects.
        const strategyCards = this._getUnpickedStrategyCards();
        for (const strategyCard of strategyCards) {
            this._placeTradeGood(strategyCard);
        }
    }
}
exports.PlaceTgsUnpicked = PlaceTgsUnpicked;
//# sourceMappingURL=place-tgs-unpicked.js.map
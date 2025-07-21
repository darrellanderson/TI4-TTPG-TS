"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyWarfare = void 0;
const abstract_strategy_card_body_1 = require("../abstract-strategy-card-body/abstract-strategy-card-body");
class BodyWarfare extends abstract_strategy_card_body_1.AbstractStrategyCardBody {
    constructor(strategyCardsState, playerSlot) {
        super(strategyCardsState, 6, playerSlot);
    }
    getStrategyCardName() {
        return "Warfare";
    }
    getBody(_scale) {
        return undefined;
    }
    getReport() {
        return undefined;
    }
}
exports.BodyWarfare = BodyWarfare;
//# sourceMappingURL=body-warfare.js.map
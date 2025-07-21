"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyConstruction = void 0;
const abstract_strategy_card_body_1 = require("../abstract-strategy-card-body/abstract-strategy-card-body");
class BodyConstruction extends abstract_strategy_card_body_1.AbstractStrategyCardBody {
    constructor(strategyCardsState, playerSlot) {
        super(strategyCardsState, 4, playerSlot);
    }
    getStrategyCardName() {
        return "Construction";
    }
    getBody(_scale) {
        return undefined;
    }
    getReport() {
        return undefined;
    }
}
exports.BodyConstruction = BodyConstruction;
//# sourceMappingURL=body-construction.js.map
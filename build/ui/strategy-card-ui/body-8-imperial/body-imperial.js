"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyImperial = void 0;
const abstract_strategy_card_body_1 = require("../abstract-strategy-card-body/abstract-strategy-card-body");
class BodyImperial extends abstract_strategy_card_body_1.AbstractStrategyCardBody {
    constructor(strategyCardsState, playerSlot) {
        super(strategyCardsState, 8, playerSlot);
    }
    getStrategyCardName() {
        return "Imperial";
    }
    getBody(_scale) {
        return undefined;
    }
    getReport() {
        return undefined;
    }
}
exports.BodyImperial = BodyImperial;
//# sourceMappingURL=body-imperial.js.map
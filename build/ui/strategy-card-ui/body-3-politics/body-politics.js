"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyPolitics = void 0;
const abstract_strategy_card_body_1 = require("../abstract-strategy-card-body/abstract-strategy-card-body");
class BodyPolitics extends abstract_strategy_card_body_1.AbstractStrategyCardBody {
    constructor(strategyCardsState, playerSlot) {
        super(strategyCardsState, 3, playerSlot);
    }
    getStrategyCardName() {
        return "Politics";
    }
    getBody(_scale) {
        return undefined;
    }
    getReport() {
        return undefined;
    }
}
exports.BodyPolitics = BodyPolitics;
//# sourceMappingURL=body-politics.js.map
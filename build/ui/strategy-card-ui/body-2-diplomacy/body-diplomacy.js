"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyDiplomacy = void 0;
const abstract_strategy_card_body_1 = require("../abstract-strategy-card-body/abstract-strategy-card-body");
class BodyDiplomacy extends abstract_strategy_card_body_1.AbstractStrategyCardBody {
    constructor(strategyCardsState, playerSlot) {
        super(strategyCardsState, 2, playerSlot);
    }
    getStrategyCardName() {
        return "Diplomacy";
    }
    getBody(_scale) {
        return undefined;
    }
    getReport() {
        return undefined;
    }
}
exports.BodyDiplomacy = BodyDiplomacy;
//# sourceMappingURL=body-diplomacy.js.map
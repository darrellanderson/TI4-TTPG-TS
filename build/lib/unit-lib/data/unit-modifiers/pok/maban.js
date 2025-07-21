"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maban = void 0;
exports.Maban = {
    name: "M'aban",
    description: "Produce an additional Fighter for their cost; it doesn't count towards production limits",
    owner: "self",
    priority: "adjust",
    triggers: [
        { cardClass: "commander", nsidName: "maban" },
        { cardClass: "alliance", nsidName: "naalu" },
    ],
    applies: (combatRoll) => {
        return combatRoll.getRollType() === "production";
    },
    apply: (combatRoll) => {
        const fighterAttrs = combatRoll.self.unitAttrsSet.getOrThrow("fighter");
        const produce = fighterAttrs.getProducePerCost();
        fighterAttrs.setProducePerCost(produce + 1);
        const quantity = fighterAttrs.getProduceQuantityDoesNotCountAgainstProductionLimits();
        fighterAttrs.setProduceQuantityDoesNotCountAgainstProductionLimits(quantity + 1);
    },
};
//# sourceMappingURL=maban.js.map
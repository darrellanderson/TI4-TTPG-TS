"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrotherOmar = void 0;
exports.BrotherOmar = {
    name: "Brother Omar",
    description: "Produce an additional Infantry for their cost; it doesn't count towards production limits.",
    owner: "self",
    priority: "adjust",
    triggers: [
        { cardClass: "commander", nsidName: "brother-omar" },
        { cardClass: "alliance", nsidName: "yin" },
    ],
    applies: (combatRoll) => {
        return combatRoll.getRollType() === "production";
    },
    apply: (combatRoll) => {
        const infantryAttrs = combatRoll.self.unitAttrsSet.getOrThrow("infantry");
        const produce = infantryAttrs.getProducePerCost();
        infantryAttrs.setProducePerCost(produce + 1);
        const quantity = infantryAttrs.getProduceQuantityDoesNotCountAgainstProductionLimits();
        infantryAttrs.setProduceQuantityDoesNotCountAgainstProductionLimits(quantity + 1);
    },
};
//# sourceMappingURL=brother-omar.js.map
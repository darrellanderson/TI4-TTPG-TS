"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavarchFeng = void 0;
exports.NavarchFeng = {
    name: "Navarch Feng",
    description: "You can produce your flagship without spending resources",
    owner: "self",
    priority: "adjust",
    triggers: [
        { cardClass: "commander", nsidName: "navarch-feng" },
        { cardClass: "alliance", nsidName: "nomad" },
    ],
    applies: (combatRoll) => {
        return combatRoll.getRollType() === "production";
    },
    apply: (combatRoll) => {
        const flagshipAttrs = combatRoll.self.unitAttrsSet.getOrThrow("flagship");
        flagshipAttrs.setCost(0);
    },
};
//# sourceMappingURL=navarch-feng.js.map
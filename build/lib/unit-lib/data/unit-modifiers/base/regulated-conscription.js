"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegulatedConscription = void 0;
exports.RegulatedConscription = {
    name: "Regulated Conscription",
    description: "Fighters and infantry cost 1 each",
    owner: "any",
    priority: "adjust",
    triggers: [{ cardClass: "agenda", nsidName: "regulated-conscription" }],
    applies: (combatRoll) => {
        return combatRoll.getRollType() === "production";
    },
    apply: (combatRoll) => {
        const fighter = combatRoll.self.unitAttrsSet.get("fighter");
        if (fighter) {
            fighter.setProducePerCost(1);
        }
        const infantry = combatRoll.self.unitAttrsSet.get("infantry");
        if (infantry) {
            infantry.setProducePerCost(1);
        }
    },
};
//# sourceMappingURL=regulated-conscription.js.map
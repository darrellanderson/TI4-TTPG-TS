"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unrelenting = void 0;
exports.Unrelenting = {
    name: "Unrelenting",
    description: "+1 to all COMBAT rolls",
    owner: "self",
    priority: "adjust",
    triggers: [{ cardClass: "faction-ability", nsidName: "unrelenting" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return rollType === "spaceCombat" || rollType === "groundCombat";
    },
    apply: (combatRoll) => {
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
            const groundCombat = unitAttrs.getGroundCombat();
            if (groundCombat) {
                groundCombat.addHit(1);
            }
            const spaceCombat = unitAttrs.getSpaceCombat();
            if (spaceCombat) {
                spaceCombat.addHit(1);
            }
        }
    },
};
//# sourceMappingURL=unrelenting.js.map
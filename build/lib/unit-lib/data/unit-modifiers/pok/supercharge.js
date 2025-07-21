"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Supercharge = void 0;
exports.Supercharge = {
    name: "Supercharge",
    description: "+1 to all COMBAT rolls",
    owner: "self",
    priority: "adjust",
    isActiveIdle: true,
    triggers: [{ cardClass: "technology.red", nsidName: "supercharge" }],
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
//# sourceMappingURL=supercharge.js.map
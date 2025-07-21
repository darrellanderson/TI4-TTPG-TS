"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fragile = void 0;
exports.Fragile = {
    name: "Fragile",
    description: "-1 to all COMBAT rolls",
    owner: "self",
    priority: "adjust",
    triggers: [{ cardClass: "faction-ability", nsidName: "fragile" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return rollType === "spaceCombat" || rollType === "groundCombat";
    },
    apply: (combatRoll) => {
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
            const spaceCombat = unitAttrs.getSpaceCombat();
            if (spaceCombat) {
                spaceCombat.addHit(-1);
            }
            const groundCombat = unitAttrs.getGroundCombat();
            if (groundCombat) {
                groundCombat.addHit(-1);
            }
        }
    },
};
//# sourceMappingURL=fragile.js.map
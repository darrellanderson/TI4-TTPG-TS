"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MunitionsReserves = void 0;
exports.MunitionsReserves = {
    name: "Munitions Reserves",
    description: "Spend 2 TGs to reroll space combat misses",
    owner: "self",
    priority: "adjust",
    triggers: [{ cardClass: "faction-ability", nsidName: "munitions-reserves" }],
    isActiveIdle: true,
    applies: (combatRoll) => {
        return combatRoll.getRollType() === "spaceCombat";
    },
    apply: (combatRoll) => {
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
            const spaceCombat = unitAttrs.getSpaceCombat();
            if (spaceCombat) {
                spaceCombat.setRerollMisses(true);
            }
        }
    },
};
//# sourceMappingURL=munitions-reserves.js.map
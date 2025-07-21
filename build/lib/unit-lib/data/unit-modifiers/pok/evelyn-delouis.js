"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvelynDelouis = void 0;
exports.EvelynDelouis = {
    name: "Evelyn Delouis",
    description: "+1 die to a single GROUND COMBAT roll",
    owner: "self",
    priority: "choose",
    isActiveIdle: true,
    triggers: [{ cardClass: "agent", nsidName: "evelyn-delouis" }],
    applies: (combatRoll) => {
        return combatRoll.getRollType() === "groundCombat";
    },
    apply: (combatRoll) => {
        const unitWithCombatAttrs = combatRoll.bestHitUnitWithCombatAttrs();
        if (unitWithCombatAttrs) {
            const combatAttrs = unitWithCombatAttrs.combatAttrs;
            combatAttrs.addExtraDice(1);
        }
    },
};
//# sourceMappingURL=evelyn-delouis.js.map
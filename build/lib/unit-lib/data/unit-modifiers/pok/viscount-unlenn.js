"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViscountUnlenn = void 0;
exports.ViscountUnlenn = {
    name: "Viscount Unlenn",
    description: "+1 die to a single SPACE COMBAT roll",
    owner: "self",
    priority: "choose",
    isActiveIdle: true,
    triggers: [{ cardClass: "agent", nsidName: "viscount-unlenn" }],
    applies: (combatRoll) => {
        return combatRoll.getRollType() === "spaceCombat";
    },
    apply: (combatRoll) => {
        const attrs = combatRoll.bestHitUnitWithCombatAttrs();
        if (attrs) {
            attrs.combatAttrs.addExtraDice(1);
        }
    },
};
//# sourceMappingURL=viscount-unlenn.js.map
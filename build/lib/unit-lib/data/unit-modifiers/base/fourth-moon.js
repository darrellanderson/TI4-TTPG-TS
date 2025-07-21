"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FourthMoon = void 0;
exports.FourthMoon = {
    name: "Fourth Moon",
    description: "Opponent's ships cannot use SUSTAIN DAMAGE",
    owner: "opponent",
    priority: "adjust",
    triggers: [{ cardClass: "unit", nsidName: "fourth-moon" }],
    applies: (combatRoll) => {
        return combatRoll.opponent.hasUnit("flagship");
    },
    apply: (combatRoll) => {
        for (const unitAttrs of combatRoll.opponent.unitAttrsSet.getAll()) {
            if (unitAttrs.hasSustainDamage()) {
                unitAttrs.setDisableSustainDamage(true);
            }
        }
    },
};
//# sourceMappingURL=fourth-moon.js.map
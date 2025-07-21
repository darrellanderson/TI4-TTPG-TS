"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TheCrownOfThalnos = void 0;
exports.TheCrownOfThalnos = {
    name: "The Crown of Thalnos",
    description: "Apply +1 to COMBAT rolls, reroll misses but must destroy any units that do not produce at least one hit",
    owner: "self",
    priority: "adjust",
    triggers: [
        {
            cardClass: "agenda",
            nsidName: "the-crown-of-thalnos",
            overrideSource: "base",
        },
        { cardClass: "relic", nsidName: "the-crown-of-thalnos" },
    ],
    isActiveIdle: true,
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return rollType === "spaceCombat" || rollType === "groundCombat";
    },
    apply: (combatRoll) => {
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
            const spaceCombat = unitAttrs.getSpaceCombat();
            if (spaceCombat) {
                spaceCombat.addHit(1);
            }
            const groundCombat = unitAttrs.getGroundCombat();
            if (groundCombat) {
                groundCombat.addHit(1);
            }
        }
    },
};
//# sourceMappingURL=the-crown-of-thalnos.js.map
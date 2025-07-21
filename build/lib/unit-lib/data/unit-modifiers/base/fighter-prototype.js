"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FighterPrototype = void 0;
exports.FighterPrototype = {
    name: "Fighter Prototype",
    description: "+2 to fighters' COMBAT rolls",
    owner: "self",
    priority: "adjust",
    triggers: [{ cardClass: "action", nsidName: "fighter-prototype" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return rollType === "spaceCombat" || rollType === "groundCombat";
    },
    apply: (combatRoll) => {
        const unitAttrs = combatRoll.self.unitAttrsSet.get("fighter");
        if (unitAttrs) {
            const spaceCombat = unitAttrs.getSpaceCombat();
            if (spaceCombat) {
                spaceCombat.addHit(2);
            }
            const groundCombat = unitAttrs.getGroundCombat();
            if (groundCombat) {
                groundCombat.addHit(2);
            }
        }
    },
};
//# sourceMappingURL=fighter-prototype.js.map
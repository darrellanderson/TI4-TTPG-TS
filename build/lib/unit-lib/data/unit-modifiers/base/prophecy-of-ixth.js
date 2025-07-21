"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProphecyOfIxth = void 0;
exports.ProphecyOfIxth = {
    name: "Prophecy of Ixth",
    description: "+1 to fighter's COMBAT rolls",
    owner: "self",
    priority: "adjust",
    triggers: [{ cardClass: "agenda", nsidName: "prophecy-of-ixth" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return rollType === "spaceCombat" || rollType === "groundCombat";
    },
    apply: (combatRoll) => {
        const fighterAttrs = combatRoll.self.unitAttrsSet.get("fighter");
        if (fighterAttrs) {
            const spaceCombat = fighterAttrs.getSpaceCombat();
            if (spaceCombat) {
                spaceCombat.addHit(1);
            }
            const groundCombat = fighterAttrs.getGroundCombat();
            if (groundCombat) {
                groundCombat.addHit(1);
            }
        }
    },
};
//# sourceMappingURL=prophecy-of-ixth.js.map
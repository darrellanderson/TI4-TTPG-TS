"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShieldPaling = void 0;
exports.ShieldPaling = {
    name: "Shield Paling",
    description: "Infantry on planet with mech are not FRAGILE",
    owner: "self",
    priority: "adjust",
    triggers: [{ cardClass: "mech", nsidName: "shield-paling" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return rollType === "groundCombat" && combatRoll.self.hasUnit("mech");
    },
    apply: (combatRoll) => {
        const infantryAttrs = combatRoll.self.unitAttrsSet.get("infantry");
        if (infantryAttrs) {
            const groundCombat = infantryAttrs.getGroundCombat();
            if (groundCombat) {
                groundCombat.addHit(1);
            }
        }
    },
};
//# sourceMappingURL=shield-paling.js.map
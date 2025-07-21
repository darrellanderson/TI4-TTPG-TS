"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrikeWingAbuscade = void 0;
exports.StrikeWingAbuscade = {
    name: "Strike Wing Ambuscade",
    description: "+1 die to a unit ability (anti-fighter barrage, bombardment, space cannon)",
    owner: "self",
    priority: "choose",
    triggers: [{ cardClass: "promissory", nsidName: "strike-wing-ambuscade" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return (rollType === "antiFighterBarrage" ||
            rollType === "bombardment" ||
            rollType === "spaceCannonDefense" ||
            rollType === "spaceCannonOffense");
    },
    apply: (combatRoll) => {
        const bestUnitWithCombatAttrs = combatRoll.bestHitUnitWithCombatAttrs();
        if (bestUnitWithCombatAttrs) {
            bestUnitWithCombatAttrs.combatAttrs.addExtraDice(1);
        }
    },
};
//# sourceMappingURL=strike-wing-ambuscade.js.map
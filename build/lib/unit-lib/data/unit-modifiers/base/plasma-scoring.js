"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlasmaScoring = void 0;
exports.PlasmaScoring = {
    name: "Plasma Scoring",
    description: "+1 dice to a single SPACE CANNON or BOMBARDMENT roll",
    owner: "self",
    priority: "choose",
    triggers: [{ cardClass: "technology.red", nsidName: "plasma-scoring" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return (rollType === "spaceCannonDefense" ||
            rollType === "spaceCannonOffense" ||
            rollType === "bombardment");
    },
    apply: (combatRoll) => {
        const combatAttrs = combatRoll.bestHitUnitWithCombatAttrs();
        if (combatAttrs) {
            combatAttrs.combatAttrs.addExtraDice(1);
        }
    },
};
//# sourceMappingURL=plasma-scoring.js.map
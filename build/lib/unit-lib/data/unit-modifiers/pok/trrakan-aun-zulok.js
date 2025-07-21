"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrrakanAunZulok = void 0;
exports.TrrakanAunZulok = {
    name: "Trrakan Aun Zulok",
    description: "+1 die to a unit ability (anti-fighter barrage, bombardment, space cannon)",
    owner: "self",
    priority: "choose",
    isActiveIdle: true,
    triggers: [
        {
            cardClass: "commander",
            nsidName: "trrakan-aun-zulok",
        },
        { cardClass: "alliance", nsidName: "argent" },
    ],
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
//# sourceMappingURL=trrakan-aun-zulok.js.map
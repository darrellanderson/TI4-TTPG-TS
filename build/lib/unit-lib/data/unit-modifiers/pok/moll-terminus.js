"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MollTerminus = void 0;
exports.MollTerminus = {
    name: "Moll Terminus",
    description: "Other's ground forces on planet cannot SUSTAIN DAMAGE",
    owner: "opponent",
    priority: "adjust",
    triggers: [{ cardClass: "mech", nsidName: "moll-terminus" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return rollType === "groundCombat" && combatRoll.opponent.hasUnit("mech");
    },
    apply: (combatRoll) => {
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
            if (unitAttrs.isGround() && unitAttrs.hasSustainDamage()) {
                unitAttrs.setDisableSustainDamage(true);
            }
        }
    },
};
//# sourceMappingURL=moll-terminus.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TheAlastor = void 0;
const combat_attrs_1 = require("../../../unit-attrs/combat-attrs");
exports.TheAlastor = {
    name: "The Alastor",
    description: "Ground forces may participate in space combat",
    owner: "self",
    priority: "mutate",
    triggers: [{ cardClass: "unit", nsidName: "the-alastor" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return rollType === "spaceCombat" && combatRoll.self.hasUnit("flagship");
    },
    apply: (combatRoll) => {
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
            const groundCombat = unitAttrs.getGroundCombat();
            if (unitAttrs.isGround() && groundCombat) {
                unitAttrs.setSpaceCombat(new combat_attrs_1.CombatAttrs({
                    dice: groundCombat.getDice(),
                    hit: groundCombat.getHit(),
                }));
            }
        }
    },
};
//# sourceMappingURL=the-alastor.js.map
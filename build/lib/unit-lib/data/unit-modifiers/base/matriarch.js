"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matriarch = void 0;
const combat_attrs_1 = require("../../../unit-attrs/combat-attrs");
exports.Matriarch = {
    name: "Matriarch",
    description: "Fighters may participate in ground combat",
    owner: "self",
    priority: "mutate",
    triggers: [{ cardClass: "unit", nsidName: "matriarch" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return (rollType === "groundCombat" &&
            combatRoll.self.hasUnit("flagship") &&
            combatRoll.self.hasUnit("fighter"));
    },
    apply: (combatRoll) => {
        const fighter = combatRoll.self.unitAttrsSet.get("fighter");
        if (fighter) {
            const spaceCombat = fighter.getSpaceCombat();
            if (spaceCombat) {
                fighter.setGroundCombat(new combat_attrs_1.CombatAttrs({
                    hit: spaceCombat.getHit(),
                }));
            }
        }
    },
};
//# sourceMappingURL=matriarch.js.map
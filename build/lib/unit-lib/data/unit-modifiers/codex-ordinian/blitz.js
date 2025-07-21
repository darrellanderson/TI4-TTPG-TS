"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blitz = void 0;
const combat_attrs_1 = require("../../../unit-attrs/combat-attrs");
exports.Blitz = {
    name: "Blitz",
    description: "BOMBARDMENT 6 to non-fighter, non-bomdbardment ships",
    owner: "self",
    priority: "mutate",
    triggers: [{ cardClass: "action", nsidName: "blitz" }],
    applies: (combatRoll) => {
        return combatRoll.getRollType() === "bombardment";
    },
    apply: (combatRoll) => {
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
            if (unitAttrs.isShip() && unitAttrs.getUnit() !== "fighter") {
                let bombardment = unitAttrs.getBombardment();
                if (!bombardment) {
                    bombardment = new combat_attrs_1.CombatAttrs({ hit: 6 });
                    unitAttrs.setBombardment(bombardment);
                }
            }
        }
    },
};
//# sourceMappingURL=blitz.js.map
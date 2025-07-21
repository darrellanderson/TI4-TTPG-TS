"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._2ram = void 0;
exports._2ram = {
    name: "2Ram",
    description: "PLANETARY SHIELD does not prevent BOMBARDMENT",
    triggers: [
        { cardClass: "commander", nsidName: "2ram" },
        { cardClass: "alliance", nsidName: "l1z1x" },
    ],
    owner: "self",
    priority: "mutate-late",
    applies: (combatRoll) => {
        return combatRoll.getRollType() === "bombardment";
    },
    apply: (combatRoll) => {
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
            if (unitAttrs.getBombardment()) {
                unitAttrs.setDisablePlanetaryShield(true);
            }
        }
    },
};
//# sourceMappingURL=2ram.js.map
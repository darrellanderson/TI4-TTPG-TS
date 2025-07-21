"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bunker = void 0;
exports.Bunker = {
    name: "Bunker",
    description: "-4 to all BOMBARDMENT rolls",
    owner: "opponent",
    priority: "adjust",
    triggers: [{ cardClass: "action", nsidName: "bunker" }],
    applies: (combatRoll) => {
        return combatRoll.getRollType() === "bombardment";
    },
    apply: (combatRoll) => {
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
            const bombardment = unitAttrs.getBombardment();
            if (bombardment) {
                bombardment.addHit(-4);
            }
        }
    },
};
//# sourceMappingURL=bunker.js.map
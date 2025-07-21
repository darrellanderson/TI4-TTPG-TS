"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmorranNorr = void 0;
exports.CmorranNorr = {
    name: "C'morran N'orr",
    description: "+1 to all COMBAT rolls for other ships with the C'morran N'orr",
    owner: "self",
    priority: "adjust",
    triggers: [{ cardClass: "unit", nsidName: "cmorran-norr" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return ((rollType === "spaceCombat" || rollType === "groundCombat") &&
            combatRoll.self.hasUnit("flagship"));
    },
    apply: (combatRoll) => {
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
            if (unitAttrs.isShip()) {
                const spaceCombat = unitAttrs.getSpaceCombat();
                if (spaceCombat) {
                    spaceCombat.addHit(1);
                }
                const groundCombat = unitAttrs.getGroundCombat();
                if (groundCombat) {
                    groundCombat.addHit(1);
                }
            }
        }
    },
};
//# sourceMappingURL=cmorran-norr.js.map
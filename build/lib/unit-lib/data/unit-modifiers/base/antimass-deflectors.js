"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntimassDeflectors = void 0;
exports.AntimassDeflectors = {
    name: "Antimass Deflectors",
    description: "-1 to all SPACE CANNON rolls",
    triggers: [
        {
            cardClass: "technology.blue",
            nsidName: "antimass-deflectors",
        },
    ],
    owner: "opponent",
    priority: "adjust",
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return (rollType === "spaceCannonOffense" || rollType === "spaceCannonDefense");
    },
    apply: (combatRoll) => {
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
            const combatAttrs = unitAttrs.getSpaceCannon();
            if (combatAttrs) {
                const oldHit = combatAttrs.getHit();
                const newHit = oldHit + 1;
                combatAttrs.setHit(newHit);
            }
        }
    },
};
//# sourceMappingURL=antimass-deflectors.js.map
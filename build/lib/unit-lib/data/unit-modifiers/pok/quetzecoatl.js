"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quetzecoatl = void 0;
exports.Quetzecoatl = {
    name: "Quetzecoatl",
    description: "Other players cannot use SPACE CANNON against your ships in this system",
    owner: "opponent",
    priority: "adjust", // mutate may add new space cannons
    triggers: [{ cardClass: "unit", nsidName: "quetzecoatl" }],
    applies: (combatRoll) => {
        return (combatRoll.getRollType() === "spaceCannonOffense" &&
            combatRoll.opponent.hasUnit("flagship"));
    },
    apply: (combatRoll) => {
        for (const unitAttrs of combatRoll.opponent.unitAttrsSet.getAll()) {
            const spaceCannon = unitAttrs.getSpaceCannon();
            if (spaceCannon) {
                unitAttrs.setDisableSpaceCannonOffense(true);
            }
        }
    },
};
//# sourceMappingURL=quetzecoatl.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperimentalBattlestation = void 0;
exports.ExperimentalBattlestation = {
    name: "Experimental Battlestation",
    description: "One in or adjacent Space Dock gets SPACE CANNON 5x3",
    owner: "self",
    priority: "mutate",
    triggers: [{ cardClass: "action", nsidName: "experimental-battlestation" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return ((rollType === "spaceCannonDefense" ||
            rollType === "spaceCannonOffense") &&
            (combatRoll.self.hasUnit("space-dock") ||
                combatRoll.self.hasUnitAdj("space-dock")));
    },
    apply: (combatRoll) => {
        const schema = {
            unit: "experimental-battlestation",
            name: "Experimental Battlestation",
            spaceCannon: { hit: 5, dice: 3, range: 1 },
        };
        combatRoll.self.addSyntheticUnit(schema, 1);
    },
};
//# sourceMappingURL=experimental-battlestation.js.map
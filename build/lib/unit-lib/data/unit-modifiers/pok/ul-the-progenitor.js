"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UlTheProgenitor = void 0;
exports.UlTheProgenitor = {
    name: "Ul the Progenitor",
    description: "SPACE CANNON 5(x3)",
    owner: "self",
    priority: "mutate",
    triggers: [{ cardClass: "hero", nsidName: "ul-the-progenitor" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        const system = combatRoll.system;
        return ((rollType === "spaceCannonDefense" ||
            rollType === "spaceCannonOffense") &&
            system !== undefined &&
            system.getSystemTileNumber() === 55);
    },
    apply: (combatRoll) => {
        const schema = {
            unit: "ul-the-progenitor",
            name: "Ul the Progenitor",
            spaceCannon: {
                hit: 5,
                dice: 3,
            },
        };
        combatRoll.self.addSyntheticUnit(schema, 1);
    },
};
//# sourceMappingURL=ul-the-progenitor.js.map
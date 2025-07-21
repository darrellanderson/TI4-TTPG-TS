"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConventionsOfWar = void 0;
exports.ConventionsOfWar = {
    name: "Conventions of War",
    description: "Players cannot use BOMBARDMENT against units that are on cultural planets",
    owner: "any",
    priority: "adjust",
    triggers: [{ cardClass: "agenda", nsidName: "conventions-of-war" }],
    applies: (combatRoll) => {
        return (combatRoll.getRollType() === "bombardment" &&
            combatRoll.planet !== undefined &&
            combatRoll.planet.getTraits().includes("cultural"));
    },
    apply: (combatRoll) => {
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
            if (unitAttrs.getBombardment() !== undefined) {
                unitAttrs.setDisableBombardment(true);
            }
        }
    },
};
//# sourceMappingURL=conventions-of-war.js.map
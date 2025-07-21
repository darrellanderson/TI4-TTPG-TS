"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RickarRickani = void 0;
exports.RickarRickani = {
    name: "Rickar Rickani",
    description: "+2 to combat rolls on Mecatol, your home system, and legendary",
    owner: "self",
    priority: "adjust",
    triggers: [
        { cardClass: "commander", nsidName: "rickar-rickani" },
        { cardClass: "alliance", nsidName: "winnu" },
    ],
    applies: (combatRoll) => {
        const system = combatRoll.system;
        if (system &&
            (combatRoll.getRollType() === "spaceCombat" ||
                combatRoll.getRollType() === "groundCombat")) {
            // Is Mecatol?
            if (system.getSystemTileNumber() === 18) {
                return true;
            }
            // Has a legendary planet?
            const planets = system.getPlanets();
            if (planets) {
                for (const planet of planets) {
                    if (planet.isLegendary()) {
                        return true;
                    }
                }
            }
            // Is self's home system?
            const faction = combatRoll.self.faction;
            if (system &&
                faction &&
                system.getSystemTileNumber() === faction.getHomeSystemTileNumber()) {
                return true;
            }
        }
        return false;
    },
    apply: (combatRoll) => {
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
            const groundCombat = unitAttrs.getGroundCombat();
            if (groundCombat) {
                groundCombat.addHit(2);
            }
            const spaceCombat = unitAttrs.getSpaceCombat();
            if (spaceCombat) {
                spaceCombat.addHit(2);
            }
        }
    },
};
//# sourceMappingURL=rickar-rickani.js.map
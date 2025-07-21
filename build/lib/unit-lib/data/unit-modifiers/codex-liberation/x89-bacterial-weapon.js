"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.X89BacterialWeapon = void 0;
exports.X89BacterialWeapon = {
    name: "X89 Bacterial Weapon",
    description: "BOMBARDMENT and GROUND COMBAT produce 2x hits",
    owner: "self",
    priority: "choose", // need to be after adjust, so crit matches hit
    triggers: [
        {
            cardClass: "technology.green",
            nsidName: "x89-bacterial-weapon",
        },
    ],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return rollType === "bombardment" || rollType === "groundCombat";
    },
    apply: (combatRoll) => {
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
            const bombardment = unitAttrs.getBombardment();
            if (bombardment) {
                bombardment.setCrit(bombardment.getHit());
                bombardment.setCritCount(1);
            }
            const groundCombat = unitAttrs.getGroundCombat();
            if (groundCombat) {
                groundCombat.setCrit(groundCombat.getHit());
                groundCombat.setCritCount(1);
            }
        }
    },
};
//# sourceMappingURL=x89-bacterial-weapon.js.map
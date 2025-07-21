"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NebulaDefense = void 0;
exports.NebulaDefense = {
    name: "Nebula Defense",
    description: "+1 to defender SPACE COMBAT rolls",
    owner: "self",
    priority: "adjust",
    triggerAlways: true,
    triggers: [],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        const isDefender = combatRoll.getActivatingPlayerSlot() !== combatRoll.self.playerSlot;
        let isNebula = false;
        if (combatRoll.system) {
            isNebula = combatRoll.system.getAnomalies().includes("nebula");
        }
        return rollType === "spaceCombat" && isNebula && isDefender;
    },
    apply: (combatRoll) => {
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
            const spaceCombat = unitAttrs.getSpaceCombat();
            if (spaceCombat) {
                spaceCombat.addHit(1);
            }
        }
    },
};
//# sourceMappingURL=nebula-defense.js.map
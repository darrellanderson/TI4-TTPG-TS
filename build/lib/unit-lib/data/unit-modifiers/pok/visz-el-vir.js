"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViszElVir = void 0;
exports.ViszElVir = {
    name: "Visz El Vir",
    description: "Your mechs in this system roll 1 additional die during combat",
    owner: "self",
    priority: "adjust",
    triggers: [{ cardClass: "unit", nsidName: "visz-el-vir" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return (rollType === "groundCombat" &&
            combatRoll.self.hasUnit("flagship") &&
            combatRoll.self.hasUnit("mech"));
    },
    apply: (combatRoll) => {
        const mechAttrs = combatRoll.self.unitAttrsSet.get("mech");
        if (mechAttrs) {
            const mechGroundCombat = mechAttrs.getGroundCombat();
            if (mechGroundCombat) {
                mechGroundCombat.addDice(1);
            }
        }
    },
};
//# sourceMappingURL=visz-el-vir.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disable = void 0;
exports.Disable = {
    name: "Disable",
    description: "Opponent PDS lose PLANETARY SHIELD and SPACE CANNON DEFENSE",
    owner: "opponent",
    priority: "adjust",
    triggers: [{ cardClass: "action", nsidName: "disable" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return rollType === "bombardment" || rollType === "spaceCannonDefense";
    },
    apply: (combatRoll) => {
        const pds = combatRoll.self.unitAttrsSet.get("pds");
        if (pds) {
            pds.setDisablePlanetaryShield(true);
            pds.setDisableSpaceCannonDefense(true);
        }
    },
};
//# sourceMappingURL=disable.js.map
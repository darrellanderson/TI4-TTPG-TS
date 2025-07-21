"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Annihilator = void 0;
exports.Annihilator = {
    name: "Annihilator",
    description: "Mech in the space area gain bombardment",
    triggers: [{ cardClass: "mech", nsidName: "annihilator" }],
    owner: "self",
    priority: "mutate",
    applies: (combatRoll) => {
        return ((combatRoll.getRollType() === "bombardment" ||
            combatRoll.getRollType() === "groundCombat") &&
            combatRoll.self.hasUnit("mech"));
    },
    apply: (combatRoll) => {
        if (combatRoll.getRollType() === "bombardment") {
            const spaceCount = combatRoll.self.unitPlasticHex.filter((plastic) => plastic.getPlanetExact() === undefined).length;
            combatRoll.self.overrideUnitCountHex.set("mech", spaceCount);
        }
        else if (combatRoll.getRollType() === "groundCombat" &&
            combatRoll.planet !== undefined) {
            const groundCount = combatRoll.self.unitPlasticHex.filter((plastic) => plastic.getPlanetExact() === combatRoll.planet).length;
            combatRoll.self.overrideUnitCountHex.set("mech", groundCount);
        }
    },
};
//# sourceMappingURL=annihilator.js.map
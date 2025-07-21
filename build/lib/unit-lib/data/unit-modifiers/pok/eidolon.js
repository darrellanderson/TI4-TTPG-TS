"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eidolon = void 0;
exports.Eidolon = {
    name: "Eidolon",
    description: "Count as ship when off planet",
    owner: "self",
    priority: "adjust",
    triggers: [{ cardClass: "mech", nsidName: "eidolon" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return ((rollType === "spaceCombat" || rollType === "groundCombat") &&
            combatRoll.self.hasUnit("mech"));
    },
    apply: (combatRoll) => {
        const mechs = combatRoll.self.unitPlasticHex.filter((plastic) => plastic.getUnit() === "mech");
        let count = 0;
        if (combatRoll.getRollType() === "spaceCombat") {
            count = mechs.filter((plastic) => plastic.getPlanetExact() === undefined).length;
        }
        else if (combatRoll.getRollType() === "groundCombat") {
            count = mechs.filter((plastic) => plastic.getPlanetExact() === combatRoll.planet).length;
        }
        combatRoll.self.overrideUnitCountHex.set("mech", count);
    },
};
//# sourceMappingURL=eidolon.js.map
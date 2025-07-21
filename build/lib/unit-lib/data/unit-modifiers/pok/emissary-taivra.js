"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmissaryTaivra = void 0;
exports.EmissaryTaivra = {
    name: "Emissary Taivra",
    description: "Active wormhole system is adjacent to all other wormholes",
    owner: "self",
    priority: "adjust",
    isActiveIdle: true,
    triggers: [{ cardClass: "agent", nsidName: "emissary-taivra" }],
    applies: (combatRoll) => {
        return combatRoll.getRollType() === "spaceCannonOffense";
    },
    apply: (_combatRoll) => {
        // nop: adjaceny lib handles this
    },
};
//# sourceMappingURL=emissary-taivra.js.map
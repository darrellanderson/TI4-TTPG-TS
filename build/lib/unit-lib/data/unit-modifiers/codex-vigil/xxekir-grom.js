"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XxekirGrom = void 0;
exports.XxekirGrom = {
    name: "Xxekir Grom",
    description: "Combine planet resources and influence",
    owner: "self",
    priority: "adjust",
    triggers: [{ cardClass: "hero", nsidName: "xxekir-grom.omega" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return rollType === "production";
    },
    apply: (_combatRoll) => { },
};
//# sourceMappingURL=xxekir-grom.js.map
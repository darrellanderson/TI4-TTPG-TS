"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MirrorComputing = void 0;
exports.MirrorComputing = {
    name: "Mirror Computing",
    description: "Tradegoods count double",
    owner: "self",
    priority: "adjust",
    triggers: [{ cardClass: "technology.yellow", nsidName: "mirror-computing" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return rollType === "production";
    },
    apply: (_combatRoll) => { },
};
//# sourceMappingURL=mirror-computing.js.map
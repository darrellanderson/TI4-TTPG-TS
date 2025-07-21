"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SarweenTools = void 0;
exports.SarweenTools = {
    name: "Sarween Tools",
    description: "-1 to production cost",
    triggers: [
        {
            cardClass: "technology.yellow",
            nsidName: "sarween-tools",
        },
    ],
    owner: "self",
    priority: "adjust",
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return rollType === "production";
    },
    apply: (_combatRoll) => { },
};
//# sourceMappingURL=sarween-tools.js.map
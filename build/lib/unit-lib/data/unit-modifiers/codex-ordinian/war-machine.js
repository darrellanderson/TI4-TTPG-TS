"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarMachine = void 0;
exports.WarMachine = {
    name: "War Machine",
    description: "+4 production, -1 to production cost",
    triggers: [
        {
            cardClass: "action",
            nsidName: "war-machine",
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
//# sourceMappingURL=war-machine.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaZern = void 0;
exports.TaZern = {
    name: "Ta Zern",
    description: "You may reroll ability dice (when active will reroll all misses)",
    owner: "self",
    priority: "adjust",
    isActiveIdle: true,
    triggers: [
        { cardClass: "commander", nsidName: "ta-zern" },
        { cardClass: "alliance", nsidName: "jolnar" },
    ],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return (rollType === "antiFighterBarrage" ||
            rollType === "bombardment" ||
            rollType === "spaceCannonDefense" ||
            rollType === "spaceCannonOffense");
    },
    apply: (combatRoll) => {
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
            const antiFighterBarrage = unitAttrs.getAntiFighterBarrage();
            if (antiFighterBarrage) {
                antiFighterBarrage.setRerollMisses(true);
            }
            const bombardment = unitAttrs.getBombardment();
            if (bombardment) {
                bombardment.setRerollMisses(true);
            }
            const spaceCannon = unitAttrs.getSpaceCannon();
            if (spaceCannon) {
                spaceCannon.setRerollMisses(true);
            }
        }
    },
};
//# sourceMappingURL=ta-zern.js.map
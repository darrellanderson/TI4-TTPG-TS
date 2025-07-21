"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaiSaiCorian = void 0;
exports.SalaiSaiCorian = {
    name: "Salai Sai Corian",
    description: "Rolls number of dice equal to number of opponent's non-fighter ships",
    owner: "self",
    priority: "adjust",
    triggers: [{ cardClass: "unit", nsidName: "salai-sai-corian" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return rollType === "spaceCombat" && combatRoll.self.hasUnit("flagship");
    },
    apply: (combatRoll) => {
        let opponentNonFighterShips = 0;
        for (const unitAttrs of combatRoll.opponent.unitAttrsSet.getAll()) {
            const unit = unitAttrs.getUnit();
            if (unitAttrs.isShip() && unit !== "fighter") {
                opponentNonFighterShips += combatRoll.opponent.getCount(unit);
            }
        }
        const flagship = combatRoll.self.unitAttrsSet.get("flagship");
        if (flagship) {
            const spaceCombat = flagship.getSpaceCombat();
            if (spaceCombat) {
                spaceCombat.setDice(opponentNonFighterShips);
            }
        }
    },
};
//# sourceMappingURL=salai-sai-corian.js.map
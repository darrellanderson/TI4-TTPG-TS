"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TekklarLegion = void 0;
exports.TekklarLegion = {
    name: "Tekklar Legion",
    description: "+1 to GROUND COMBAT rolls for attacker, -1 to Sardakk if opponent owns",
    owner: "any", // this one is funky
    priority: "adjust",
    triggers: [{ cardClass: "promissory", nsidName: "tekklar-legion" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        if (rollType === "groundCombat") {
            const tekklarCard = combatRoll.find.findCard("card.promissory:base/tekklar-legion");
            if (tekklarCard) {
                const pos = tekklarCard.getPosition();
                const owner = combatRoll.find.closestOwnedCardHolderOwner(pos);
                let selfFactionIsNorr = false;
                if (combatRoll.self.faction) {
                    selfFactionIsNorr =
                        combatRoll.self.faction.getNsid() === "faction:base/norr";
                }
                return (owner === combatRoll.self.playerSlot ||
                    (owner === combatRoll.opponent.playerSlot && selfFactionIsNorr));
            }
        }
        return false;
    },
    apply: (combatRoll) => {
        const tekklarCard = combatRoll.find.findCard("card.promissory:base/tekklar-legion");
        let delta = 0;
        if (tekklarCard) {
            const pos = tekklarCard.getPosition();
            const owner = combatRoll.find.closestOwnedCardHolderOwner(pos);
            if (owner === combatRoll.self.playerSlot) {
                delta = 1;
            }
            else if (owner === combatRoll.opponent.playerSlot) {
                delta = -1;
            }
        }
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
            const groundCombat = unitAttrs.getGroundCombat();
            if (groundCombat) {
                groundCombat.addHit(delta);
            }
        }
    },
};
//# sourceMappingURL=tekklar-legion.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustodiaVigilia = void 0;
exports.CustodiaVigilia = {
    name: "Custodia Vigilia",
    description: "SPACE CANNON 5, +3 prod to Mecatol Rex",
    owner: "self",
    priority: "mutate",
    triggers: [{ cardClass: "legendary", nsidName: "custodia-vigilia" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        const system = combatRoll.system;
        if ((rollType === "spaceCannonDefense" ||
            rollType === "spaceCannonOffense") &&
            system !== undefined &&
            system.getSystemTileNumber() === 18) {
            // Does player control Mecatol Rex?
            const planetCard = combatRoll.find.findCard("card.planet:base/mecatol-rex");
            if (planetCard) {
                const pos = planetCard.getPosition();
                const owner = combatRoll.find.closestOwnedCardHolderOwner(pos);
                return owner === combatRoll.self.playerSlot;
            }
        }
        return false;
    },
    apply: (combatRoll) => {
        const schema = {
            name: "Custodia Vigilia",
            unit: "custodia-vigilia",
            spaceCannon: {
                hit: 5,
            },
        };
        combatRoll.self.addSyntheticUnit(schema, 1);
    },
};
//# sourceMappingURL=custodia-vigilia.js.map
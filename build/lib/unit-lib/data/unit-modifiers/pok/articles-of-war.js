"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesOfWar = void 0;
exports.ArticlesOfWar = {
    name: "Articles of War",
    description: "Mechs lose non-SUSTAIN DAMAGE abilities",
    triggers: [{ cardClass: "agenda", nsidName: "articles-of-war" }],
    owner: "any",
    priority: "mutate",
    applies: (combatRoll) => {
        return combatRoll.self.hasUnit("mech");
    },
    apply: (combatRoll) => {
        const mechAttrs = combatRoll.self.unitAttrsSet.get("mech");
        if (mechAttrs) {
            mechAttrs.setAntiFighterBarrage(undefined);
            mechAttrs.setBombardment(undefined);
            mechAttrs.setSpaceCannon(undefined);
            mechAttrs.setHasPlanetaryShield(false);
        }
    },
};
//# sourceMappingURL=articles-of-war.js.map
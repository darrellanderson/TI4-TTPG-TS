"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Iconoclast = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
exports.Iconoclast = {
    name: "Iconoclast",
    description: "+2 mech COMBAT rolls if opponent has fragment",
    owner: "self",
    priority: "mutate",
    triggers: [{ cardClass: "mech", nsidName: "iconoclast" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        if (rollType === "groundCombat" && combatRoll.self.hasUnit("mech")) {
            // Look for fragment on opponent.
            const fragmentNsids = new Set([
                "card.exploration.cultural:pok/cultural-fragment",
                "card.exploration.industrial:pok/industrial-fragment",
                "card.exploration.hazardous:pok/hazardous-fragment",
                "card.exploration.frontier:pok/frontier-fragment",
            ]);
            const skipContained = true;
            for (const obj of api_1.world.getAllObjects(skipContained)) {
                const nsid = ttpg_darrell_1.NSID.get(obj);
                if (fragmentNsids.has(nsid) &&
                    combatRoll.find.closestOwnedCardHolderOwner(obj.getPosition()) ===
                        combatRoll.opponent.playerSlot) {
                    return true;
                }
            }
        }
        return false;
    },
    apply: (combatRoll) => {
        const mechAttrs = combatRoll.self.unitAttrsSet.get("mech");
        if (mechAttrs) {
            const groundCombat = mechAttrs.getGroundCombat();
            if (groundCombat) {
                groundCombat.addHit(2);
            }
        }
    },
};
//# sourceMappingURL=iconoclast.js.map
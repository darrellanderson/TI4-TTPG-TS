"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mordred = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
exports.Mordred = {
    name: "Mordred",
    description: "+2 mech COMBAT rolls if opponent has X/Y token",
    owner: "self",
    priority: "adjust",
    triggers: [{ cardClass: "mech", nsidName: "mordred" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        if (rollType === "groundCombat" && combatRoll.self.hasUnit("mech")) {
            // Look for x/y token on opponent.
            const nekroTokenNsids = new Set([
                "token:base/nekro-x",
                "token:base/nekro-y",
            ]);
            const skipContained = true;
            for (const obj of api_1.world.getAllObjects(skipContained)) {
                const nsid = ttpg_darrell_1.NSID.get(obj);
                if (nekroTokenNsids.has(nsid) &&
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
//# sourceMappingURL=mordred.js.map
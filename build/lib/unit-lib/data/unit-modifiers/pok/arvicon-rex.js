"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArviconRex = void 0;
const command_token_counter_1 = require("../../../../command-token-lib/command-token-counter/command-token-counter");
exports.ArviconRex = {
    name: "Arvicon Rex",
    description: "+2 flagship COMBAT against opponent with no token in your fleet pool",
    owner: "self",
    priority: "adjust",
    triggers: [{ cardClass: "unit", nsidName: "arvicon-rex" }],
    applies: (combatRoll) => {
        return combatRoll.self.hasUnit("flagship");
    },
    apply: (combatRoll) => {
        const commandTokenCounter = new command_token_counter_1.CommandTokenCounter();
        const playerSlotToCommandTokenCounts = commandTokenCounter.getPlayerSlotToCommandTokenCounts();
        const commandTokenCounts = playerSlotToCommandTokenCounts.get(combatRoll.self.playerSlot);
        if (commandTokenCounts) {
            const fleetTokens = commandTokenCounts.fleet;
            for (const fleetToken of fleetTokens) {
                if (fleetToken.getOwningPlayerSlot() === combatRoll.opponent.playerSlot) {
                    const combatAttrs = combatRoll.self.unitAttrsSet
                        .getOrThrow("flagship")
                        .getSpaceCombatOrThrow();
                    combatAttrs.addHit(2);
                }
                break;
            }
        }
    },
};
//# sourceMappingURL=arvicon-rex.js.map
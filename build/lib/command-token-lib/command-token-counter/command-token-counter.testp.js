"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_token_counter_1 = require("./command-token-counter");
const playerSlotToCounts = new command_token_counter_1.CommandTokenCounter().getPlayerSlotToCommandTokenCounts();
for (const [playerSlot, counts] of playerSlotToCounts) {
    console.log(`Player slot ${playerSlot}`);
    console.log(`  Tactic: ${counts.tactic.length}`);
    console.log(`  Fleet: ${counts.fleet.length}`);
    console.log(`  Strategy: ${counts.strategy.length}`);
}
//# sourceMappingURL=command-token-counter.testp.js.map
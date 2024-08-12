import {
  CommandTokenCounter,
  CommandTokenCounts,
} from "./command-token-counter";

const playerSlotToCounts: Map<number, CommandTokenCounts> =
  new CommandTokenCounter().getPlayerSlotToCommandTokenCounts();

for (const [playerSlot, counts] of playerSlotToCounts) {
  console.log(`Player slot ${playerSlot}`);
  console.log(`  Tactic: ${counts.tactic.length}`);
  console.log(`  Fleet: ${counts.fleet.length}`);
  console.log(`  Strategy: ${counts.strategy.length}`);
}

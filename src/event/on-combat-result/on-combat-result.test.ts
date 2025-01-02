import { DiceResult } from "ttpg-darrell";
import { CombatRoll } from "../../lib/combat-lib/combat-roll/combat-roll";

it("handler", () => {
  const combatRoll = new CombatRoll({
    rollType: "spaceCombat",
    rollingPlayerSlot: 10,
    activatingPlayerSlot: 11,
    hex: "<0,0,0>",
  });
  const diceResults: Array<DiceResult> = [];
  TI4.events.onCombatResult.trigger(combatRoll, diceResults);
});

import { DiceResult } from "ttpg-darrell";
import { CombatRoll } from "../../lib/combat-lib/combat-roll/combat-roll";
import { OnCombatResult } from "./on-combat-result";

it("init/destroy", () => {
  const onCombatResult: OnCombatResult = new OnCombatResult();
  onCombatResult.init();
  onCombatResult.destroy();
});

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

import { DiceResult } from "ttpg-darrell";
import { CombatRoll } from "../combat-roll/combat-roll";
import { CombatRollSummary } from "./combat-roll-summary";

it("constructor", () => {
  const combatRoll: CombatRoll = new CombatRoll({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 10,
    rollingPlayerSlot: 10,
  });
  const diceResults: Array<DiceResult> = [];
  const roll = new CombatRollSummary(combatRoll, diceResults);
  expect(roll).toBeTruthy();
});

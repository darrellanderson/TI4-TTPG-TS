import { CombatRoll, CombatRollParams } from "./combat-roll";

it("constructor", () => {
  const params: CombatRollParams = {
    type: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 2,
    rollingPlayerSlot: 3,
  };
  const combatRoll: CombatRoll = new CombatRoll(params);
  expect(combatRoll.getType()).toBe("spaceCombat");
});

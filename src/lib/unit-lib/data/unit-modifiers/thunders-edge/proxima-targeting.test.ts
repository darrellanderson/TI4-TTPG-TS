import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, SELF } from "../abstract.test";

it("proxima targeting", () => {
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "proximaTargeting",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Proxima Targeting"]);
});

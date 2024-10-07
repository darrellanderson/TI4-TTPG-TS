import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";

it("registry", () => {
  const nsid = "card.technology.yellow:base/mirror-computing";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Mirror Computing"
  );
});

it("modifier", () => {
  placeGameObjects({ self: ["card.technology.yellow:base/mirror-computing"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "production",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Mirror Computing"]);
});

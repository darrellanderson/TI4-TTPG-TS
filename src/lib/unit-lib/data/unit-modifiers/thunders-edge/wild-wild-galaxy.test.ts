import { CombatRoll, CombatRollParams } from "../../../../combat-lib";
import { OPPONENT, SELF, placeGameObjects } from "../abstract.test";

it("registry", () => {
  const nsid: string = "card.event:thunders-edge/wild-wild-galaxy";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
});

it("modifier", () => {
  let combatRoll: CombatRoll;
  const combatParams: CombatRollParams = {
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };

  combatRoll = CombatRoll.createCooked(combatParams);
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("fighter")
      .getSpaceCombatOrThrow()
      .getHit()
  ).toBe(9);

  placeGameObjects({
    any: ["card.event:thunders-edge/wild-wild-galaxy"],
    self: ["card.action:base/morale-boost"],
  });
  combatRoll = CombatRoll.createCooked(combatParams);
  expect(combatRoll.getUnitModifierNames()).toEqual([
    "Morale Boost",
    "Wild Wild Galaxy",
  ]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("fighter")
      .getSpaceCombatOrThrow()
      .getHit()
  ).toBe(7);
});

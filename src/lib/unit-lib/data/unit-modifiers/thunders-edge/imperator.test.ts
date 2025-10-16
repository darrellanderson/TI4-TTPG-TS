import { CombatRoll, CombatRollParams } from "../../../../combat-lib";
import { placeGameObjects, SELF, OPPONENT } from "../abstract.test";

import { _countSupports } from "./imperator";

it("registry", () => {
  const nsid: string = "card.breakthrough:thunders-edge/imperator";
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
    any: ["card.breakthrough:thunders-edge/imperator"],
    opponent: [
      "card.promissory:base/support-for-the-throne",
      "card.promissory:base/support-for-the-throne",
    ],
  });
  combatRoll = CombatRoll.createCooked(combatParams);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Imperator"]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("fighter")
      .getSpaceCombatOrThrow()
      .getHit()
  ).toBe(7);
});

it("_countSupports", () => {
  placeGameObjects({
    opponent: [
      "card.promissory:base/support-for-the-throne",
      "card.promissory:base/support-for-the-throne",
    ],
  });
  const count: number = _countSupports(OPPONENT);
  expect(count).toBe(2);
});

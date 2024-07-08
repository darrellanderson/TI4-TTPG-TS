import exp from "constants";
import {
  CombatRoll,
  CombatRollParams,
} from "../../../combat-lib/combat-roll/combat-roll";
import { placeGameObjects } from "./abstract.test";

it("2ram", () => {
  const params: CombatRollParams = {
    type: "bombardment",
    hex: "<0,0,0>",
    activatingPlayerSlot: 1,
    rollingPlayerSlot: 2,
  };
  let combatRoll: CombatRoll;

  combatRoll = CombatRoll.createCooked(params);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("dreadnought")
      .getDisablePlanetaryShield()
  ).toBe(false);

  placeGameObjects({
    self: ["card.leader.commander:pok/2ram"],
  });
  combatRoll = CombatRoll.createCooked(params);
  expect(combatRoll.getUnitModifierNames()).toEqual(["2Ram"]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("dreadnought")
      .getDisablePlanetaryShield()
  ).toBe(true);
});

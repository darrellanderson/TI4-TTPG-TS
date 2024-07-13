import {
  CombatRoll,
  CombatRollParams,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";

it("2ram (registry)", () => {
  const nsid = "card.leader.commander:pok/2ram";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
});

it("2ram", () => {
  // PLANETARY SHIELD does not prevent BOMBARDMENT
  const params: CombatRollParams = {
    rollType: "bombardment",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
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

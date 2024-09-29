import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "unit:base/the-alastor";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "The Alastor",
  );
});

it("default", () => {
  placeGameObjects({});
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const infantry: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  expect(infantry.getSpaceCombat()).toBeUndefined();
});

it("modifier", () => {
  placeGameObjects({
    self: ["unit:base/the-alastor"],
    selfUnits: new Map([["flagship", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["The Alastor"]);

  const infantry: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  expect(infantry.getSpaceCombat()?.getHit()).toBe(8);
});

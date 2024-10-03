import { UnitAttrs } from "../../../../unit-lib/unit-attrs/unit-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, SELF, placeGameObjects } from "../abstract.test";

it("registry (commander)", () => {
  const nsid = "card.leader.commander:pok/maban";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe("M'aban");
});

it("registry (alliance)", () => {
  const nsid = "card.alliance:pok/naalu";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe("M'aban");
});

it("no modifier", () => {
  placeGameObjects({});
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "production",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  const fighterAttrs: UnitAttrs | undefined =
    combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  expect(fighterAttrs.getProducePerCost()).toBe(2);
  expect(
    fighterAttrs.getProduceQuantityDoesNotCountAgainstProductionLimits()
  ).toBe(0);
});

it("maban (commander)", () => {
  placeGameObjects({
    self: ["card.leader.commander:pok/maban"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "production",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["M'aban"]);
  const fighterAttrs: UnitAttrs | undefined =
    combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  expect(fighterAttrs.getProducePerCost()).toBe(3);
  expect(
    fighterAttrs.getProduceQuantityDoesNotCountAgainstProductionLimits()
  ).toBe(1);
});

it("maban (alliance)", () => {
  placeGameObjects({
    self: ["card.alliance:pok/naalu"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "production",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["M'aban"]);
  const fighterAttrs: UnitAttrs | undefined =
    combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  expect(fighterAttrs.getProducePerCost()).toBe(3);
  expect(
    fighterAttrs.getProduceQuantityDoesNotCountAgainstProductionLimits()
  ).toBe(1);
});

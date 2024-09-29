import { UnitAttrs } from "../../../../unit-lib/unit-attrs/unit-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, SELF, placeGameObjects } from "../abstract.test";

it("registry (commander)", () => {
  const nsid = "card.leader.commander:pok/brother-omar";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Brother Omar",
  );
});

it("registry (alliance)", () => {
  const nsid = "card.alliance:pok/yin";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Brother Omar",
  );
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
  const infantryAttrs: UnitAttrs | undefined =
    combatRoll.self.unitAttrsSet.get("infantry");
  expect(infantryAttrs?.getProducePerCost()).toBe(2);
  expect(
    infantryAttrs?.getProduceQuantityDoesNotCountAgainstProductionLimits(),
  ).toBe(0);
});

it("brother-omar (commander)", () => {
  placeGameObjects({
    self: ["card.leader.commander:pok/brother-omar"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "production",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Brother Omar"]);
  const infantryAttrs: UnitAttrs | undefined =
    combatRoll.self.unitAttrsSet.get("infantry");
  expect(infantryAttrs?.getProducePerCost()).toBe(3);
  expect(
    infantryAttrs?.getProduceQuantityDoesNotCountAgainstProductionLimits(),
  ).toBe(1);
});

it("brother-omar (alliance)", () => {
  placeGameObjects({
    self: ["card.alliance:pok/yin"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "production",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Brother Omar"]);
  const infantryAttrs: UnitAttrs | undefined =
    combatRoll.self.unitAttrsSet.get("infantry");
  expect(infantryAttrs?.getProducePerCost()).toBe(3);
  expect(
    infantryAttrs?.getProduceQuantityDoesNotCountAgainstProductionLimits(),
  ).toBe(1);
});

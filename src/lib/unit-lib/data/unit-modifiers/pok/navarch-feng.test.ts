import { UnitAttrs } from "../../../../unit-lib/unit-attrs/unit-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, SELF, placeGameObjects } from "../abstract.test";

it("registry (commander)", () => {
  const nsid = "card.leader.commander:pok/navarch-feng";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Navarch Feng",
  );
});

it("registry (alliance)", () => {
  const nsid = "card.alliance:pok/nomad";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Navarch Feng",
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
  const flagshipAttrs: UnitAttrs | undefined =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  expect(flagshipAttrs.getCost()).toBe(8);
});

it("navarch-feng (commander)", () => {
  placeGameObjects({
    self: ["card.leader.commander:pok/navarch-feng"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "production",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Navarch Feng"]);
  const flagshipAttrs: UnitAttrs | undefined =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  expect(flagshipAttrs.getCost()).toBe(0);
});

it("navarch-feng (alliance)", () => {
  placeGameObjects({
    self: ["card.alliance:pok/nomad"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "production",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Navarch Feng"]);
  const flagshipAttrs: UnitAttrs | undefined =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  expect(flagshipAttrs.getCost()).toBe(0);
});

import { UnitAttrs } from "../../../../unit-lib/unit-attrs/unit-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, SELF, placeGameObjects } from "../abstract.test";

it("registry", () => {
  const nsid = "card.agenda:pok/articles-of-war";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
});

it("letani-behemoth", () => {
  placeGameObjects({
    self: ["card.leader.mech:pok/letani-behemoth"],
    selfUnits: new Map([["mech", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  const mechAttrs: UnitAttrs | undefined =
    combatRoll.self.unitAttrsSet.get("mech");
  expect(mechAttrs?.getName()).toBe("Letani Behemoth");
  expect(mechAttrs?.hasPlanetaryShild()).toBe(true);
});

it("articles-of-war", () => {
  placeGameObjects({
    self: ["card.leader.mech:pok/letani-behemoth"],
    selfUnits: new Map([["mech", 1]]),
    any: ["card.agenda:pok/articles-of-war"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Articles of War"]);
  const mechAttrs: UnitAttrs | undefined =
    combatRoll.self.unitAttrsSet.get("mech");
  expect(mechAttrs?.getName()).toBe("Letani Behemoth");
  expect(mechAttrs?.hasPlanetaryShild()).toBe(false);
});

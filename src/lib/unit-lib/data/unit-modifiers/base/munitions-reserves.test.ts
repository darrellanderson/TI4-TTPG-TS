import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "faction-ability:base/munitions-reserves";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Munitions Reserves"
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

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const spaceCombat: CombatAttrs = dreadnought.getSpaceCombatOrThrow();
  expect(spaceCombat.getRerollMisses()).toBe(false);
});

it("modifier", () => {
  placeGameObjects({ selfActive: ["faction-ability:base/munitions-reserves"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Munitions Reserves"]);

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const spaceCombat: CombatAttrs = dreadnought.getSpaceCombatOrThrow();
  expect(spaceCombat.getRerollMisses()).toBe(true);
});

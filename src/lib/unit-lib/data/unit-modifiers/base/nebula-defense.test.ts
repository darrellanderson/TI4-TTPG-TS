import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  TI4.unitModifierRegistry
    .getAlways()
    .map((unitModifier) => unitModifier.getName())
    .includes("Nebula Defense");
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
  expect(spaceCombat.getHit()).toBe(5);
});

it("modifier", () => {
  placeGameObjects({ systemNsid: "tile.system:base/42" });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getActivatingPlayerSlot()).toBe(OPPONENT);
  expect(combatRoll.self.playerSlot).toBe(SELF);
  expect(combatRoll.system?.getAnomalies().includes("nebula")).toBe(true);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Nebula Defense"]);

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const spaceCombat: CombatAttrs = dreadnought.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(4);
});

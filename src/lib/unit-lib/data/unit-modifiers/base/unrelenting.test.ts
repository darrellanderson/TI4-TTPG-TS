import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "faction-ability:base/unrelenting";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Unrelenting"
  );
});

it("default", () => {
  placeGameObjects({});
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const dreadnoughtSpaceCombat: CombatAttrs =
    dreadnought.getSpaceCombatOrThrow();
  expect(dreadnoughtSpaceCombat.getHit()).toBe(5);
});

it("modifier (space combat)", () => {
  placeGameObjects({ self: ["faction-ability:base/unrelenting"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const dreadnoughtSpaceCombat: CombatAttrs =
    dreadnought.getSpaceCombatOrThrow();
  expect(dreadnoughtSpaceCombat.getHit()).toBe(4);
});

it("modifier (ground combat)", () => {
  placeGameObjects({ self: ["faction-ability:base/unrelenting"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const dreadnoughtSpaceCombat: CombatAttrs =
    dreadnought.getSpaceCombatOrThrow();
  expect(dreadnoughtSpaceCombat.getHit()).toBe(4);
});

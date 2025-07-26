import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "card.event:test/morale-boost-extra";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Morale Boost Extra"
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

  const fighter: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const spaceCombat: CombatAttrs = fighter.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(9);

  const infantry: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  const groundCombat: CombatAttrs = infantry.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(8);
});

it("modifier", () => {
  placeGameObjects({
    self: [
      "card.action:base/morale-boost",
      "card.event:test/morale-boost-extra",
    ],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([
    "Morale Boost",
    "Morale Boost Extra",
  ]);

  const fighter: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const spaceCombat: CombatAttrs = fighter.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(7);

  const infantry: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  const groundCombat: CombatAttrs = infantry.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(6);
});

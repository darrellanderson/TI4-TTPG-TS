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
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const fighter: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const spaceCombat: CombatAttrs = fighter.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(9);
});

it("modifier", () => {
  placeGameObjects({
    self: ["card.event:test/system-class-bonus"],
    systemNsid: "tile.system:base/51",
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["System Class Bonus"]);

  const fighter: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const spaceCombat: CombatAttrs = fighter.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(8);
});

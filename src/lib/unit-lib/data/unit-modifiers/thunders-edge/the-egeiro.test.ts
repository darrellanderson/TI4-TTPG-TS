import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "unit:thunders-edge/the-egeiro";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "The Egeiro"
  );
});

it("default", () => {
  placeGameObjects({
    selfUnits: new Map([["flagship", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.self.getCount("flagship")).toBe(1);
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const fighter: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const spaceCombat: CombatAttrs = fighter.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(13);
});

it("modifier, no controlled systems", () => {
  placeGameObjects({
    self: ["unit:thunders-edge/the-egeiro"],
    selfUnits: new Map([["flagship", 1]]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.self.getCount("flagship")).toBe(1);
  expect(combatRoll.getUnitModifierNames()).toEqual(["The Egeiro"]);

  const fighter: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const spaceCombat: CombatAttrs = fighter.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(9);
});

it("modifier, no controlled systems", () => {
  placeGameObjects({
    self: ["unit:thunders-edge/the-egeiro"],
    selfUnits: new Map([
      ["flagship", 1],
      ["infantry", 1],
    ]),
    systemNsid: "tile.system:base/18",
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.self.getCount("flagship")).toBe(1);
  expect(combatRoll.getUnitModifierNames()).toEqual(["The Egeiro"]);

  const fighter: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const spaceCombat: CombatAttrs = fighter.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(8);
});

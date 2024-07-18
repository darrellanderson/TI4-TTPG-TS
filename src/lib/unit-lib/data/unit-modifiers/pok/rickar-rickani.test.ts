import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { Faction } from "../../../../faction-lib/faction/faction";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry (commander)", () => {
  const nsid = "card.leader.commander:pok/rickar-rickani";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Rickar Rickani"
  );
});

it("registry (alliance)", () => {
  const nsid = "card.alliance:pok/winnu";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Rickar Rickani"
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

  const fighterAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const fighterSpaceCombat: CombatAttrs = fighterAttrs.getSpaceCombatOrThrow();
  expect(fighterSpaceCombat.getHit()).toBe(9);

  const infantryAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  const infantryGroundCombat: CombatAttrs =
    infantryAttrs.getGroundCombatOrThrow();
  expect(infantryGroundCombat.getHit()).toBe(8);
});

it("modifier (mecatol, commander, space combat)", () => {
  placeGameObjects({
    systemNsid: "tile.system:base/18",
    self: ["card.leader.commander:pok/rickar-rickani"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.system?.getSystemTileNumber()).toBe(18);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Rickar Rickani"]);

  const fighterAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const fighterSpaceCombat: CombatAttrs = fighterAttrs.getSpaceCombatOrThrow();
  expect(fighterSpaceCombat.getHit()).toBe(7);

  const infantryAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  const infantryGroundCombat: CombatAttrs =
    infantryAttrs.getGroundCombatOrThrow();
  expect(infantryGroundCombat.getHit()).toBe(6);
});

it("modifier (mecatol, alliance, space combat)", () => {
  placeGameObjects({
    systemNsid: "tile.system:base/18",
    self: ["card.alliance:pok/winnu"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.system?.getSystemTileNumber()).toBe(18);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Rickar Rickani"]);

  const fighterAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const fighterSpaceCombat: CombatAttrs = fighterAttrs.getSpaceCombatOrThrow();
  expect(fighterSpaceCombat.getHit()).toBe(7);

  const infantryAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  const infantryGroundCombat: CombatAttrs =
    infantryAttrs.getGroundCombatOrThrow();
  expect(infantryGroundCombat.getHit()).toBe(6);
});

it("modifier (mecatol, ground combat)", () => {
  placeGameObjects({
    systemNsid: "tile.system:base/18",
    self: ["card.leader.commander:pok/rickar-rickani"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Mecatol Rex",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.system?.getSystemTileNumber()).toBe(18);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Rickar Rickani"]);

  const fighterAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const fighterSpaceCombat: CombatAttrs = fighterAttrs.getSpaceCombatOrThrow();
  expect(fighterSpaceCombat.getHit()).toBe(7);

  const infantryAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  const infantryGroundCombat: CombatAttrs =
    infantryAttrs.getGroundCombatOrThrow();
  expect(infantryGroundCombat.getHit()).toBe(6);
});

it("modifier (mecatol, bombardment)", () => {
  placeGameObjects({
    systemNsid: "tile.system:base/18",
    self: ["card.leader.commander:pok/rickar-rickani"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "bombardment",
    hex: "<0,0,0>",
    planetName: "Mecatol Rex",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.system?.getSystemTileNumber()).toBe(18);
  expect(combatRoll.getUnitModifierNames()).toEqual([]); // no effect on bombardment
});

it("modifier (legendary)", () => {
  placeGameObjects({
    systemNsid: "tile.system:pok/65", // primor
    self: ["card.leader.commander:pok/rickar-rickani"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.system?.getSystemTileNumber()).toBe(65);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Rickar Rickani"]);

  const fighterAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const fighterSpaceCombat: CombatAttrs = fighterAttrs.getSpaceCombatOrThrow();
  expect(fighterSpaceCombat.getHit()).toBe(7);

  const infantryAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  const infantryGroundCombat: CombatAttrs =
    infantryAttrs.getGroundCombatOrThrow();
  expect(infantryGroundCombat.getHit()).toBe(6);
});

it("modifier (home)", () => {
  placeGameObjects({
    systemNsid: "tile.system:base/1",
    self: ["card.leader.commander:pok/rickar-rickani"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
    overrideRollingFaction: new Faction(), // for now uses '1' as home system tile number
  });
  expect(combatRoll.system?.getSystemTileNumber()).toBe(1);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Rickar Rickani"]);

  const fighterAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const fighterSpaceCombat: CombatAttrs = fighterAttrs.getSpaceCombatOrThrow();
  expect(fighterSpaceCombat.getHit()).toBe(7);

  const infantryAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  const infantryGroundCombat: CombatAttrs =
    infantryAttrs.getGroundCombatOrThrow();
  expect(infantryGroundCombat.getHit()).toBe(6);
});

import { MockGameObject } from "ttpg-mock";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { System } from "../../../../system-lib/system/system";
import {
  _countAdjacentPdsInAnomaly,
  _hasNullAbilityAnomaly,
} from "./anomaly-null-ability";

it("_hasNullAbilityAnomaly", () => {
  MockGameObject.simple("tile.system:base/18");
  const tile18: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(18);
  expect(_hasNullAbilityAnomaly(tile18)).toBe(false);

  MockGameObject.simple("tile.system:base/44");
  const tile44: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(44);
  expect(_hasNullAbilityAnomaly(tile44)).toBe(true);

  expect(_hasNullAbilityAnomaly(undefined)).toBe(false);
});

it("_countAdjacentPdsInAnomaly", () => {
  placeGameObjects({
    selfUnitsAdj: new Map([["pds", 1]]),
    systemNsidAdj: "tile.system:base/45",
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(_countAdjacentPdsInAnomaly(combatRoll)).toBe(1);
});

it("registry", () => {
  const nsid = "card.event:test/anomaly-null-ability";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Anomaly Null Ability"
  );
});

it("default", () => {
  placeGameObjects({
    self: ["card.technology.unit-upgrade:base/pds-2"],
    selfUnits: new Map([["pds", 1]]),
    selfUnitsAdj: new Map([["pds", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(combatRoll.self.getCount("pds")).toBe(1);
  expect(combatRoll.self.getCountAdj("pds")).toBe(1);
  expect(
    combatRoll.self.unitAttrsSet.getOrThrow("pds").getSpaceCannon()
  ).toBeDefined();
});

it("modifier", () => {
  placeGameObjects({
    self: [
      "card.technology.unit-upgrade:base/pds-2",
      "card.event:test/anomaly-null-ability",
    ],
    selfUnits: new Map([["pds", 1]]),
    systemNsid: "tile.system:base/44",
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(_hasNullAbilityAnomaly(combatRoll.system)).toBe(true);
  expect(_countAdjacentPdsInAnomaly(combatRoll)).toBe(0);

  expect(combatRoll.getUnitModifierNames()).toEqual(["Anomaly Null Ability"]);
  expect(combatRoll.self.getCount("pds")).toBe(1);
  expect(combatRoll.self.getCountAdj("pds")).toBe(0);
  expect(
    combatRoll.self.unitAttrsSet.getOrThrow("pds").getSpaceCannon()
  ).toBeUndefined();
});

it("modifier (adj)", () => {
  placeGameObjects({
    self: [
      "card.technology.unit-upgrade:base/pds-2",
      "card.event:test/anomaly-null-ability",
    ],
    selfUnitsAdj: new Map([["pds", 1]]),
    systemNsidAdj: "tile.system:base/44",
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(_hasNullAbilityAnomaly(combatRoll.system)).toBe(false);
  expect(_countAdjacentPdsInAnomaly(combatRoll)).toBe(1);

  expect(combatRoll.getUnitModifierNames()).toEqual(["Anomaly Null Ability"]);
  expect(combatRoll.self.getCount("pds")).toBe(0);
  expect(combatRoll.self.getCountAdj("pds")).toBe(0);
  expect(
    combatRoll.self.unitAttrsSet.getOrThrow("pds").getSpaceCannon()
  ).toBeDefined();
});

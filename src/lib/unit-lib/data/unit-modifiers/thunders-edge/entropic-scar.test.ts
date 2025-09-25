import { MockGameObject } from "ttpg-mock";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { SourceAndPackageIdSchemaType } from "../../../../system-lib/schema/basic-types-schema";
import { System } from "../../../../system-lib/system/system";
import { SystemRegistry } from "../../../../system-lib/registry/system-registry";
import { SystemSchemaType } from "../../../../system-lib/schema/system-schema";
import {
  _countAdjacentPdsInEntropicScar,
  _isEntropicScar,
} from "./entropic-scar";

beforeEach(() => {
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  const systemSchemaTypes: Array<SystemSchemaType> = [
    {
      tile: 1234,
      anomalies: ["scar"],
    },
  ];
  const systemRegistry: SystemRegistry = globalThis.TI4.systemRegistry;
  systemRegistry.load(sourceAndPackageId, systemSchemaTypes);
});

it("_isEntropicScar", () => {
  MockGameObject.simple("tile.system:base/18");
  const tile18: System | undefined =
    globalThis.TI4.systemRegistry.getBySystemTileNumber(18);
  expect(_isEntropicScar(tile18)).toBe(false);

  MockGameObject.simple("tile.system:my-source/1234");
  const tile44: System | undefined =
    globalThis.TI4.systemRegistry.getBySystemTileNumber(1234);
  expect(_isEntropicScar(tile44)).toBe(true);

  expect(_isEntropicScar(undefined)).toBe(false);
});

it("_countAdjacentPdsInEntropicScar", () => {
  placeGameObjects({
    selfUnitsAdj: new Map([["pds", 1]]),
    systemNsidAdj: "tile.system:my-source/1234",
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(_countAdjacentPdsInEntropicScar(combatRoll)).toBe(1);
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
    self: ["card.technology.unit-upgrade:base/pds-2"],
    selfUnits: new Map([["pds", 1]]),
    systemNsid: "tile.system:my-source/1234",
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(_isEntropicScar(combatRoll.system)).toBe(true);
  expect(_countAdjacentPdsInEntropicScar(combatRoll)).toBe(0);

  expect(combatRoll.getUnitModifierNames()).toEqual(["Entropic Scar"]);
  expect(combatRoll.self.getCount("pds")).toBe(1);
  expect(combatRoll.self.getCountAdj("pds")).toBe(0);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("pds")
      .getDisableSpaceCannonOffense()
  ).toBe(true);
});

it("modifier (adj)", () => {
  placeGameObjects({
    self: ["card.technology.unit-upgrade:base/pds-2"],
    selfUnitsAdj: new Map([["pds", 1]]),
    systemNsidAdj: "tile.system:my-source/1234",
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(_isEntropicScar(combatRoll.system)).toBe(false);
  expect(_countAdjacentPdsInEntropicScar(combatRoll)).toBe(1);

  expect(combatRoll.getUnitModifierNames()).toEqual(["Entropic Scar"]);
  expect(combatRoll.self.getCount("pds")).toBe(0);
  expect(combatRoll.self.getCountAdj("pds")).toBe(0);
  expect(
    combatRoll.self.unitAttrsSet.getOrThrow("pds").getSpaceCannon()
  ).toBeDefined();
});

it("modifier (space cannon defense)", () => {
  placeGameObjects({
    self: ["card.technology.unit-upgrade:base/pds-2"],
    selfUnits: new Map([["pds", 1]]),
    systemNsid: "tile.system:my-source/1234",
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonDefense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(_isEntropicScar(combatRoll.system)).toBe(true);
  expect(_countAdjacentPdsInEntropicScar(combatRoll)).toBe(0);

  expect(combatRoll.getUnitModifierNames()).toEqual(["Entropic Scar"]);
  expect(combatRoll.self.getCount("pds")).toBe(1);
  expect(combatRoll.self.getCountAdj("pds")).toBe(0);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("pds")
      .getDisableAntiFighterBarrage()
  ).toBe(true);
  expect(
    combatRoll.self.unitAttrsSet.getOrThrow("pds").getDisableBombardment()
  ).toBe(true);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("pds")
      .getDisableSpaceCannonDefense()
  ).toBe(true);
  expect(
    combatRoll.self.unitAttrsSet.getOrThrow("pds").getDisablePlanetaryShield()
  ).toBe(true);
  expect(
    combatRoll.self.unitAttrsSet.getOrThrow("pds").getDisableSustainDamage()
  ).toBe(true);
});

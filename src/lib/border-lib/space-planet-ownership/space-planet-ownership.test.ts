import { GameObject } from "@tabletop-playground/api";
import { HexType } from "ttpg-darrell";
import { MockGameObject } from "ttpg-mock";
import {
  ControlObjType,
  ControlSystemType,
  SpacePlanetOwnership,
} from "./space-planet-ownership";
import { UnitPlastic } from "../../unit-lib/unit-plastic/unit-plastic";

it("constructor", () => {
  new SpacePlanetOwnership();
});

it("_createControlTypeFromUnitPlastic (ship)", () => {
  const systemTileObj: GameObject = MockGameObject.simple(
    "tile.system:base/18"
  );
  const obj: GameObject = MockGameObject.simple("unit:base/fighter", {
    owningPlayerSlot: 13,
  });

  const plastic: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  if (!plastic) {
    throw new Error("UnitPlastic not found");
  }
  UnitPlastic.assignPlanets([plastic]);

  const ownership = new SpacePlanetOwnership();
  const controlObjType: ControlObjType | undefined =
    ownership._createControlTypeFromUnitPlastic(plastic);
  if (!controlObjType) {
    throw new Error("controlObjType not found");
  }
  expect(controlObjType.obj).toBe(obj);
  expect(controlObjType.owningPlayerSlot).toBe(13);
  expect(controlObjType.hex).toBe("<0,0,0>");
  expect(controlObjType.system.getObj()).toBe(systemTileObj);
  expect(controlObjType.planet).toBeUndefined();
});

it("_createControlTypeFromUnitPlastic (ground)", () => {
  const systemTileObj: GameObject = MockGameObject.simple(
    "tile.system:base/18"
  );
  const obj: GameObject = MockGameObject.simple("unit:base/mech", {
    owningPlayerSlot: 13,
  });

  const plastic: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  if (!plastic) {
    throw new Error("UnitPlastic not found");
  }
  UnitPlastic.assignPlanets([plastic]);

  const ownership = new SpacePlanetOwnership();
  const controlObjType: ControlObjType | undefined =
    ownership._createControlTypeFromUnitPlastic(plastic);
  if (!controlObjType) {
    throw new Error("controlObjType not found");
  }
  expect(controlObjType.obj).toBe(obj);
  expect(controlObjType.owningPlayerSlot).toBe(13);
  expect(controlObjType.hex).toBe("<0,0,0>");
  expect(controlObjType.system.getObj()).toBe(systemTileObj);
  expect(controlObjType.planet?.getName()).toBe("Mecatol Rex");
});

it("_createControlTypeFromUnitPlastic (no system tile)", () => {
  const obj: GameObject = MockGameObject.simple("unit:base/mech", {
    owningPlayerSlot: 13,
  });

  const plastic: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  if (!plastic) {
    throw new Error("UnitPlastic not found");
  }
  UnitPlastic.assignPlanets([plastic]);

  const ownership = new SpacePlanetOwnership();
  const controlObjType: ControlObjType | undefined =
    ownership._createControlTypeFromUnitPlastic(plastic);
  expect(controlObjType).toBeUndefined();
});

it("_createControlTypeFromControlToken", () => {
  const systemTileObj: GameObject = MockGameObject.simple(
    "tile.system:base/18"
  );
  const controlToken: GameObject = MockGameObject.simple("token:base/control", {
    owningPlayerSlot: 13,
  });

  const ownership = new SpacePlanetOwnership();
  const controlObjType: ControlObjType | undefined =
    ownership._createControlTypeFromControlToken(controlToken);
  if (!controlObjType) {
    throw new Error("controlObjType not found");
  }
  expect(controlObjType.obj).toBe(controlToken);
  expect(controlObjType.owningPlayerSlot).toBe(13);
  expect(controlObjType.hex).toBe("<0,0,0>");
  expect(controlObjType.system.getObj()).toBe(systemTileObj);
  expect(controlObjType.planet?.getName()).toBe("Mecatol Rex");
});

it("_createControlTypeFromControlToken (not a control token)", () => {
  const controlToken: GameObject = MockGameObject.simple("token:base/command", {
    owningPlayerSlot: 13,
  });

  const ownership = new SpacePlanetOwnership();
  const controlObjType: ControlObjType | undefined =
    ownership._createControlTypeFromControlToken(controlToken);
  expect(controlObjType).toBeUndefined();
});

it("_createControlTypeFromControlToken (no system tile)", () => {
  const controlToken: GameObject = MockGameObject.simple("token:base/control", {
    owningPlayerSlot: 13,
  });

  const ownership = new SpacePlanetOwnership();
  const controlObjType: ControlObjType | undefined =
    ownership._createControlTypeFromControlToken(controlToken);
  expect(controlObjType).toBeUndefined();
});

it("_getAllControlEntries", () => {
  MockGameObject.simple("tile.system:base/18");
  const unitObj: GameObject = MockGameObject.simple("unit:base/mech");
  const controlToken: GameObject = MockGameObject.simple("token:base/control");

  const ownership = new SpacePlanetOwnership();
  const controlObjTypes: Array<ControlObjType> =
    ownership._getAllControlEntries();
  expect(controlObjTypes.length).toBe(2);
  expect(controlObjTypes[0]?.obj).toBe(unitObj);
  expect(controlObjTypes[1]?.obj).toBe(controlToken);
});

it("getHexToControlSystemEntries", () => {
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple("unit:base/destroyer", { owningPlayerSlot: 13 });
  MockGameObject.simple("unit:base/destroyer", { owningPlayerSlot: 13 });
  MockGameObject.simple("token:base/control", { owningPlayerSlot: 14 });

  const ownership = new SpacePlanetOwnership();
  const hexToControlSystemEntry: Map<HexType, ControlSystemType> =
    ownership.getHexToControlSystemEntry();

  expect(hexToControlSystemEntry.size).toBe(1);
  const controlSystemType: ControlSystemType | undefined =
    hexToControlSystemEntry.get("<0,0,0>");
  expect(controlSystemType?.hex).toBe("<0,0,0>");
  expect(controlSystemType?.system.getSystemTileNumber()).toBe(18);
  expect(controlSystemType?.spaceOwningPlayerSlot).toBe(13);
  expect(
    controlSystemType?.planetNameToOwningPlayerSlot.get("Mecatol Rex")
  ).toBe(14);
});

it("getHexToControlSystemEntries (conflicting units in space, ground)", () => {
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple("unit:base/destroyer", { owningPlayerSlot: 13 });
  MockGameObject.simple("unit:base/destroyer", { owningPlayerSlot: 14 }); // Conflict.
  MockGameObject.simple("token:base/control", { owningPlayerSlot: 14 });
  MockGameObject.simple("unit:pok/mech", { owningPlayerSlot: 13 }); // Conflict.

  const ownership = new SpacePlanetOwnership();
  const hexToControlSystemEntry: Map<HexType, ControlSystemType> =
    ownership.getHexToControlSystemEntry();

  expect(hexToControlSystemEntry.size).toBe(1);
  const controlSystemType: ControlSystemType | undefined =
    hexToControlSystemEntry.get("<0,0,0>");
  expect(controlSystemType?.hex).toBe("<0,0,0>");
  expect(controlSystemType?.system.getSystemTileNumber()).toBe(18);
  expect(controlSystemType?.spaceOwningPlayerSlot).toBe(-2);
  expect(
    controlSystemType?.planetNameToOwningPlayerSlot.get("Mecatol Rex")
  ).toBe(-2);
});

it("getHexToControlSystemEntries (no space, ground)", () => {
  MockGameObject.simple("tile.system:base/18");

  const ownership = new SpacePlanetOwnership();
  const hexToControlSystemEntry: Map<HexType, ControlSystemType> =
    ownership.getHexToControlSystemEntry();

  expect(hexToControlSystemEntry.size).toBe(1);
  const controlSystemType: ControlSystemType | undefined =
    hexToControlSystemEntry.get("<0,0,0>");
  expect(controlSystemType?.hex).toBe("<0,0,0>");
  expect(controlSystemType?.system.getSystemTileNumber()).toBe(18);
  expect(controlSystemType?.spaceOwningPlayerSlot).toBe(-1);
  expect(
    controlSystemType?.planetNameToOwningPlayerSlot.get("Mecatol Rex")
  ).toBe(-1);
});

import { GameObject } from "@tabletop-playground/api";
import { MockGameObject } from "ttpg-mock";
import { ControlType, SpacePlanetOwnership } from "./space-planet-ownership";
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
  const controlType: ControlType | undefined =
    ownership._createControlTypeFromUnitPlastic(plastic);
  if (!controlType) {
    throw new Error("ControlType not found");
  }
  expect(controlType.obj).toBe(obj);
  expect(controlType.owningPlayerSlot).toBe(13);
  expect(controlType.hex).toBe("<0,0,0>");
  expect(controlType.system.getObj()).toBe(systemTileObj);
  expect(controlType.planet).toBeUndefined();
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
  const controlType: ControlType | undefined =
    ownership._createControlTypeFromUnitPlastic(plastic);
  if (!controlType) {
    throw new Error("ControlType not found");
  }
  expect(controlType.obj).toBe(obj);
  expect(controlType.owningPlayerSlot).toBe(13);
  expect(controlType.hex).toBe("<0,0,0>");
  expect(controlType.system.getObj()).toBe(systemTileObj);
  expect(controlType.planet?.getName()).toBe("Mecatol Rex");
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
  const controlType: ControlType | undefined =
    ownership._createControlTypeFromUnitPlastic(plastic);
  expect(controlType).toBeUndefined();
});

it("_createControlTypeFromControlToken", () => {
  const systemTileObj: GameObject = MockGameObject.simple(
    "tile.system:base/18"
  );
  const controlToken: GameObject = MockGameObject.simple("token:base/control", {
    owningPlayerSlot: 13,
  });

  const ownership = new SpacePlanetOwnership();
  const controlType: ControlType | undefined =
    ownership._createControlTypeFromControlToken(controlToken);
  if (!controlType) {
    throw new Error("ControlType not found");
  }
  expect(controlType.obj).toBe(controlToken);
  expect(controlType.owningPlayerSlot).toBe(13);
  expect(controlType.hex).toBe("<0,0,0>");
  expect(controlType.system.getObj()).toBe(systemTileObj);
  expect(controlType.planet?.getName()).toBe("Mecatol Rex");
});

it("_createControlTypeFromControlToken (no system tile)", () => {
  const controlToken: GameObject = MockGameObject.simple("token:base/control", {
    owningPlayerSlot: 13,
  });

  const ownership = new SpacePlanetOwnership();
  const controlType: ControlType | undefined =
    ownership._createControlTypeFromControlToken(controlToken);
  expect(controlType).toBeUndefined();
});

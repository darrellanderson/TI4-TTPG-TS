import { GameObject, Vector } from "@tabletop-playground/api";
import { MockGameObject } from "ttpg-mock";

import { UnitPlastic } from "./unit-plastic";
import { UnitType } from "../schema/unit-attrs-schema";
import exp from "constants";
import { HexType } from "ttpg-darrell";

it("static count", () => {
  const unitPlastics: Array<UnitPlastic> = [
    new UnitPlastic("infantry", 1, new MockGameObject()),
    new UnitPlastic("infantry", 1, new MockGameObject()),
    new UnitPlastic("fighter", 3, new MockGameObject()),
  ];
  const result: Map<UnitType, number> = UnitPlastic.count(unitPlastics);
  expect(result.get("infantry")).toBe(2);
  expect(result.get("fighter")).toBe(3);
});

it("constructor", () => {
  const unit: UnitType = "infantry";
  const count: number = 1;
  const obj: GameObject = new MockGameObject();
  new UnitPlastic(unit, count, obj);
});

it("getOne (plastic)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "unit:base/infantry",
    owningPlayerSlot: 2,
  });
  const entry: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  expect(entry?.getCount()).toBe(1);
  expect(entry?.getHex()).toBe("<0,0,0>");
  expect(entry?.getObj()).toBe(obj);
  expect(entry?.getOwningPlayerSlot()).toBe(2);
  expect(entry?.getPlanetClosest()).toBeUndefined();
  expect(entry?.getPlanetExact()).toBeUndefined();
  expect(entry?.getUnit()).toBe("infantry");
});

it("getOne (unknown)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "unit:base/__unknown__",
  });
  const entry: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  expect(entry).toBeUndefined();
});

it("getOne (invalid nsid, match enough to check)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "unit:@@@",
  });
  const entry: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  expect(entry).toBeUndefined();
});

it("getOne (fighter-1 token)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token:base/fighter-1",
  });
  const entry: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  expect(entry?.getCount()).toBe(1);
  expect(entry?.getHex()).toBe("<0,0,0>");
  expect(entry?.getObj()).toBe(obj);
  expect(entry?.getOwningPlayerSlot()).toBe(-1);
  expect(entry?.getPlanetClosest()).toBeUndefined();
  expect(entry?.getPlanetExact()).toBeUndefined();
  expect(entry?.getUnit()).toBe("fighter");
});

it("getOne (fighter-3 token)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token:base/fighter-3",
  });
  const entry: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  expect(entry?.getCount()).toBe(3);
  expect(entry?.getHex()).toBe("<0,0,0>");
  expect(entry?.getObj()).toBe(obj);
  expect(entry?.getOwningPlayerSlot()).toBe(-1);
  expect(entry?.getPlanetClosest()).toBeUndefined();
  expect(entry?.getPlanetExact()).toBeUndefined();
  expect(entry?.getUnit()).toBe("fighter");
});

it("getOne (infantry-1 token)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token:base/infantry-1",
  });
  const entry: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  expect(entry?.getCount()).toBe(1);
  expect(entry?.getHex()).toBe("<0,0,0>");
  expect(entry?.getObj()).toBe(obj);
  expect(entry?.getOwningPlayerSlot()).toBe(-1);
  expect(entry?.getPlanetClosest()).toBeUndefined();
  expect(entry?.getPlanetExact()).toBeUndefined();
  expect(entry?.getUnit()).toBe("infantry");
});

it("getOne (infantry-3 token)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token:base/infantry-3",
  });
  const entry: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  expect(entry?.getCount()).toBe(3);
  expect(entry?.getHex()).toBe("<0,0,0>");
  expect(entry?.getObj()).toBe(obj);
  expect(entry?.getOwningPlayerSlot()).toBe(-1);
  expect(entry?.getPlanetClosest()).toBeUndefined();
  expect(entry?.getPlanetExact()).toBeUndefined();
  expect(entry?.getUnit()).toBe("infantry");
});

it("getAll (empty)", () => {
  const result: Array<UnitPlastic> = UnitPlastic.getAll();
  expect(result).toEqual([]);
});

it("getAll (single)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "unit:base/infantry",
  });
  const result: Array<UnitPlastic> = UnitPlastic.getAll();
  expect(result).toHaveLength(1);
  expect(result[0]?.getUnit()).toBe("infantry");
});

it("assignOwners", () => {
  const plastic: UnitPlastic = new UnitPlastic(
    "infantry",
    1,
    new MockGameObject({ owningPlayerSlot: 2 })
  );
  const token: UnitPlastic = new UnitPlastic(
    "infantry",
    1,
    new MockGameObject()
  );
  expect(plastic.getOwningPlayerSlot()).toBe(2);
  expect(token.getOwningPlayerSlot()).toBe(-1);

  UnitPlastic.assignOwners([plastic, token]);
  expect(plastic.getOwningPlayerSlot()).toBe(2);
  expect(token.getOwningPlayerSlot()).toBe(2);
});

it("assignPlanets", () => {
  new MockGameObject({ templateMetadata: "tile.system:base/1" });
  const plastic: UnitPlastic = new UnitPlastic(
    "infantry",
    1,
    new MockGameObject()
  );

  // Compute a position still inside the hex, but off the planet.
  const pos: Vector = TI4.hex.toPosition("<1,0,-1>").multiply(0.45);
  const plasticOffPlanet: UnitPlastic = new UnitPlastic(
    "infantry",
    1,
    new MockGameObject({ position: pos })
  );
  expect(plasticOffPlanet.getHex()).toBe("<0,0,0>");

  expect(plastic.getPlanetClosest()).toBeUndefined();
  expect(plastic.getPlanetExact()).toBeUndefined();
  expect(plasticOffPlanet.getPlanetClosest()).toBeUndefined();
  expect(plasticOffPlanet.getPlanetExact()).toBeUndefined();

  UnitPlastic.assignPlanets([plastic, plasticOffPlanet]);
  expect(plastic.getPlanetClosest()).toBeDefined();
  expect(plastic.getPlanetExact()).toBeDefined();
  expect(plasticOffPlanet.getPlanetClosest()).toBeDefined();
  expect(plasticOffPlanet.getPlanetExact()).toBeUndefined();
});

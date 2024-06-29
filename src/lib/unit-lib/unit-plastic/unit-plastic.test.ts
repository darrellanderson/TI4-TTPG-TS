import { GameObject } from "@tabletop-playground/api";
import { UnitPlastic, UnitPlasticEntry } from "./unit-plastic";
import { MockGameObject } from "ttpg-mock";

it("constructor", () => {
  new UnitPlastic();
});

it("getOne (plastic)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "unit:base/infantry",
    owningPlayerSlot: 1,
  });
  const entry: UnitPlasticEntry | undefined = new UnitPlastic().getOne(obj);
  expect(entry?.unit).toBe("infantry");
  expect(entry?.count).toBe(1);
  expect(entry?.owningPlayerSlot).toBe(1);
});

it("getOne (unknown)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "unit:base/__unknown__",
  });
  const entry: UnitPlasticEntry | undefined = new UnitPlastic().getOne(obj);
  expect(entry).toBeUndefined();
});

it("getOne (invalid nsid, match enough to check)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "unit:@@@",
  });
  const entry: UnitPlasticEntry | undefined = new UnitPlastic().getOne(obj);
  expect(entry).toBeUndefined();
});

it("getOne (fighter-1 token)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token:base/fighter-1",
  });
  const entry: UnitPlasticEntry | undefined = new UnitPlastic().getOne(obj);
  expect(entry?.unit).toBe("fighter");
  expect(entry?.count).toBe(1);
  expect(entry?.owningPlayerSlot).toBe(-1);
});

it("getOne (fighter-3 token)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token:base/fighter-3",
  });
  const entry: UnitPlasticEntry | undefined = new UnitPlastic().getOne(obj);
  expect(entry?.unit).toBe("fighter");
  expect(entry?.count).toBe(3);
  expect(entry?.owningPlayerSlot).toBe(-1);
});

it("getOne (infantry-1 token)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token:base/infantry-1",
  });
  const entry: UnitPlasticEntry | undefined = new UnitPlastic().getOne(obj);
  expect(entry?.unit).toBe("infantry");
  expect(entry?.count).toBe(1);
  expect(entry?.owningPlayerSlot).toBe(-1);
});

it("getOne (infantry-3 token)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token:base/infantry-3",
  });
  const entry: UnitPlasticEntry | undefined = new UnitPlastic().getOne(obj);
  expect(entry?.unit).toBe("infantry");
  expect(entry?.count).toBe(3);
  expect(entry?.owningPlayerSlot).toBe(-1);
});

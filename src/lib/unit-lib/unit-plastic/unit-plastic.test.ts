import { GameObject } from "@tabletop-playground/api";
import { UnitPlastic, UnitPlasticEntry } from "./unit-plastic";
import { MockGameObject } from "ttpg-mock";

it("constructor", () => {
  new UnitPlastic();
});

it("getOne", () => {
  const unitPlastic = new UnitPlastic();

  const obj: GameObject = new MockGameObject({
    templateMetadata: "unit:base/infantry",
    owningPlayerSlot: 1,
  });
  const entry: UnitPlasticEntry | undefined = unitPlastic.getOne(obj);
  expect(entry?.unit).toBe("infantry");
  expect(entry?.owningPlayerSlot).toBe(1);
});

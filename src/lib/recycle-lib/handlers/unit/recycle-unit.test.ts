import { MockContainer, MockGameObject } from "ttpg-mock";
import { RecycleUnit } from "./recycle-unit";
import { Container, GameObject } from "@tabletop-playground/api";
import { GarbageHandler } from "ttpg-darrell";

it("constructor", () => {
  new RecycleUnit();
});

it("recycle", () => {
  const token: GameObject = new MockGameObject({
    id: "my-unit-id",
    templateMetadata: "unit:base/carrier",
    owningPlayerSlot: 1,
  });
  const container: Container = new MockContainer({
    templateMetadata: "container.unit:base/carrier",
    owningPlayerSlot: 1,
  });

  const recycle: GarbageHandler = new RecycleUnit();
  expect(recycle.canRecycle(token)).toBe(true);
  expect(recycle.recycle(token)).toBe(true);
  expect(container.getItems().map((x) => x.getId())).toEqual(["my-unit-id"]);
});

it("recycle (container owner mismatch)", () => {
  const token: GameObject = new MockGameObject({
    id: "my-unit-id",
    templateMetadata: "unit:base/carrier",
    owningPlayerSlot: 1,
  });
  const container: Container = new MockContainer({
    templateMetadata: "container.unit:base/carrier",
    owningPlayerSlot: 2,
  });

  const recycle: GarbageHandler = new RecycleUnit();
  expect(recycle.canRecycle(token)).toBe(true);
  expect(recycle.recycle(token)).toBe(false);
  expect(container.getItems().map((x) => x.getId())).toEqual([]);
});

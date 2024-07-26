import { MockContainer, MockGameObject } from "ttpg-mock";
import { RecycleTokenControl } from "./recycle-token-control";
import { Container, GameObject } from "@tabletop-playground/api";
import { GarbageHandler } from "ttpg-darrell";

it("recycle", () => {
  const token: GameObject = new MockGameObject({
    id: "my-token-id",
    templateMetadata: "token:base/control",
    owningPlayerSlot: 1,
  });
  const container: Container = new MockContainer({
    templateMetadata: "container.token:base/control",
    owningPlayerSlot: 1,
  });

  const recycle: GarbageHandler = new RecycleTokenControl();
  expect(recycle.canRecycle(token)).toBe(true);
  expect(recycle.recycle(token)).toBe(true);
  expect(container.getItems().map((x) => x.getId())).toEqual(["my-token-id"]);
});

it("recycle (container owner mismatch)", () => {
  const token: GameObject = new MockGameObject({
    id: "my-token-id",
    templateMetadata: "token:base/control",
    owningPlayerSlot: 1,
  });
  const container: Container = new MockContainer({
    templateMetadata: "container.token:base/control",
    owningPlayerSlot: 2,
  });

  const recycle: GarbageHandler = new RecycleTokenControl();
  expect(recycle.canRecycle(token)).toBe(true);
  expect(recycle.recycle(token)).toBe(false);
  expect(container.getItems().map((x) => x.getId())).toEqual([]);
});

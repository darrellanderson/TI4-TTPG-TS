import { Container, GameObject } from "@tabletop-playground/api";
import { GarbageHandler } from "ttpg-darrell";
import { MockContainer, MockGameObject } from "ttpg-mock";
import { RecycleTokenGalvanize } from "./recycle-token-galvanize";

it("recycle", () => {
  const token: GameObject = new MockGameObject({
    id: "my-token-id",
    templateMetadata: "token:thunders-edge/galvanize",
    owningPlayerSlot: 1,
  });
  const container: Container = new MockContainer({
    templateMetadata: "container:base/faction-extras",
    owningPlayerSlot: 1,
  });

  const recycle: GarbageHandler = new RecycleTokenGalvanize();
  expect(recycle.canRecycle(token)).toBe(true);
  expect(recycle.recycle(token)).toBe(true);
  expect(container.getItems().map((x) => x.getId())).toEqual(["my-token-id"]);
});

it("recycle (container owner mismatch)", () => {
  const token: GameObject = new MockGameObject({
    id: "my-token-id",
    templateMetadata: "token:thunders-edge/galvanize",
    owningPlayerSlot: 1,
  });
  const container: Container = new MockContainer({
    templateMetadata: "container:base/faction-extras",
    owningPlayerSlot: 2,
  });

  const recycle: GarbageHandler = new RecycleTokenGalvanize();
  expect(recycle.canRecycle(token)).toBe(true);
  expect(recycle.recycle(token)).toBe(false);
  expect(container.getItems().map((x) => x.getId())).toEqual([]);
});

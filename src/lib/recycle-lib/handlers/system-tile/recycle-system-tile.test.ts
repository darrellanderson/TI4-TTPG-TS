import { Container, GameObject } from "@tabletop-playground/api";
import { GarbageHandler } from "ttpg-darrell";
import { MockContainer, MockGameObject } from "ttpg-mock";
import { RecycleSystemTile } from "./recycle-system-tile";

it("recycle", () => {
  const systemObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:base/18",
  });
  const container: Container = new MockContainer({
    templateMetadata: "container:base/systems",
  });

  expect(systemObj.getContainer()).toBeUndefined();
  expect(container.getNumItems()).toBe(0);

  const recycle: GarbageHandler = new RecycleSystemTile();
  expect(recycle.canRecycle(systemObj)).toBe(true);
  expect(recycle.recycle(systemObj)).toBe(true);

  expect(systemObj.getContainer()).toBe(container);
  expect(container.getNumItems()).toBe(1);
});

it("recycle (missing container)", () => {
  const systemObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:base/18",
  });

  const recycle: GarbageHandler = new RecycleSystemTile();
  expect(recycle.canRecycle(systemObj)).toBe(true);
  expect(recycle.recycle(systemObj)).toBe(false);
});

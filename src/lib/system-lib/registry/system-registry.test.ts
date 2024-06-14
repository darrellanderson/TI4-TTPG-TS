import { MockGameObject } from "ttpg-mock";
import { SystemRegistry } from "./system-registry";
import { Vector, world } from "@tabletop-playground/api";

it("constructor", () => {
  new SystemRegistry();
});

it("onObjectCreated/Destroyed", () => {
  const registry = new SystemRegistry().load([{ tile: 12 }], "my-source");
  expect(registry.rawBySystemTileNumber(12)).toBeDefined();

  let obj = new MockGameObject({
    id: "my-id",
    templateMetadata: "tile.system:my-source/12",
  });
  expect(registry.rawBySystemTileNumber(12)).toBeDefined();
  expect(registry.getBySystemTileObjId("my-id")).toBeDefined();

  obj.destroy();
  expect(registry.rawBySystemTileNumber(12)).toBeDefined();
  expect(registry.getBySystemTileObjId("my-id")).toBeUndefined();

  registry.destroy();
});

it("load (system tile obj exists)", () => {
  new MockGameObject({
    id: "my-id",
    templateMetadata: "tile.system:my-source/12",
  });
  const registry = new SystemRegistry().load([{ tile: 12 }], "my-source");

  // Tile system exists, but not linked to object.
  const tileSystem = registry.rawBySystemTileNumber(12);
  expect(tileSystem).toBeDefined();
  expect(tileSystem?.getSystemTileObjId()).toBeUndefined();

  // Obj id system exists and is linked to object.
  const objSystem = registry.getBySystemTileObjId("my-id");
  expect(objSystem).toBeDefined();
  expect(objSystem?.getSystemTileObjId()).toBe("my-id");
  registry.destroy();
});

it("load (duplicate system tile)", () => {
  const registry = new SystemRegistry();
  expect(registry.rawBySystemTileNumber(12)).toBeUndefined();

  // Add first.
  registry.load([{ tile: 12 }], "base");
  expect(registry.rawBySystemTileNumber(12)?.getSource()).toBe("base");

  // Add duplicate, expect ignored but non-duplicate entries still added.
  expect(() => {
    registry.load([{ tile: 11 }, { tile: 12 }, { tile: 13 }], "homebrew");
  }).toThrow();
  expect(registry.rawBySystemTileNumber(11)?.getSource()).toBe("homebrew");
  expect(registry.rawBySystemTileNumber(12)?.getSource()).toBe("base"); // not overwritten
  expect(registry.rawBySystemTileNumber(13)?.getSource()).toBeUndefined(); // throw before added

  registry.destroy();
});

it("load (invalid schema)", () => {
  const registry = new SystemRegistry();
  expect(() => {
    registry.load(
      [{ tile: 12, planets: [{ name: "x", nsidName: "@@" }] }],
      "base"
    );
  }).toThrow();
  registry.destroy();
});

it("loadDefaultData", () => {
  const registry = new SystemRegistry();
  expect(registry.rawBySystemTileNumber(12)).toBeUndefined();
  registry.loadDefaultData();
  expect(registry.rawBySystemTileNumber(12)).toBeDefined();
  registry.destroy();
});

it("getByPosition", () => {
  const z: number = world.getTableHeight();
  const pos = new Vector(1, 0, z);
  const registry = new SystemRegistry().load([{ tile: 12 }], "my-source");
  expect(registry.getByPosition(pos)).toBeUndefined();

  const obj = new MockGameObject({
    id: "my-id",
    position: pos,
    templateMetadata: "tile.system:my-source/12",
  });
  expect(registry.getByPosition(pos)).toBeDefined();

  obj.destroy();
  expect(registry.getByPosition(pos)).toBeUndefined();

  registry.destroy();
});

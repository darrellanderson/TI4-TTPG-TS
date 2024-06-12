import { MockGameObject } from "ttpg-mock";
import { SystemRegistry } from "./system-registry";

it("constructor", () => {
  new SystemRegistry();
});

it("onObjectCreated/Destroyed", () => {
  const registry = new SystemRegistry().load([{ tile: 12 }], "my-source");
  const system = registry.getBySystemTileNumber(12);
  expect(registry.getBySystemTileNsid("tile.system:my-source/12")).toBe(system);
  expect(system?.getSystemTileObjId()).toBeUndefined();

  let obj = new MockGameObject({
    id: "my-id",
    templateMetadata: "tile.system:my-source/12",
  });
  expect(registry.getBySystemTileNsid("tile.system:my-source/12")).toBe(system);
  expect(system?.getSystemTileObjId()).toBe("my-id");

  obj.destroy();
  expect(registry.getBySystemTileNsid("tile.system:my-source/12")).toBe(system);
  expect(system?.getSystemTileObjId()).toBeUndefined();

  // Call with some bogus nsids to exercise those paths.
  obj = new MockGameObject({
    id: "my-id",
    templateMetadata: "tile.system;;invalid-nsid",
  });
  obj.destroy();

  obj = new MockGameObject({
    id: "my-id",
    templateMetadata: "tile.system:base/abc",
  });
  obj.destroy();

  obj = new MockGameObject({
    id: "my-id",
    templateMetadata: "tile.system:base/999",
  });
  obj.destroy();

  registry.destroy();
});

it("load (system tile obj exists)", () => {
  new MockGameObject({
    id: "my-id",
    templateMetadata: "tile.system:my-source/12",
  });
  const registry = new SystemRegistry().load([{ tile: 12 }], "my-source");
  const system = registry.getBySystemTileNumber(12);
  expect(system?.getSystemTileObjId()).toBe("my-id");
  registry.destroy();
});

it("load (duplicate system tile)", () => {
  const registry = new SystemRegistry();
  expect(registry.getBySystemTileNumber(12)).toBeUndefined();

  // Add first.
  registry.load([{ tile: 12 }], "base");
  expect(registry.getBySystemTileNumber(12)?.getSource()).toBe("base");

  // Add duplicate, expect ignored but non-duplicate entries still added.
  expect(() => {
    registry.load([{ tile: 11 }, { tile: 12 }, { tile: 13 }], "homebrew");
  }).toThrow();
  expect(registry.getBySystemTileNumber(11)?.getSource()).toBe("homebrew");
  expect(registry.getBySystemTileNumber(12)?.getSource()).toBe("base"); // not overwritten
  expect(registry.getBySystemTileNumber(13)?.getSource()).toBeUndefined(); // throw before added

  registry.destroy();
});

it("loadDefaultData", () => {
  const registry = new SystemRegistry();
  expect(registry.getBySystemTileNumber(12)).toBeUndefined();
  registry.loadDefaultData();
  expect(registry.getBySystemTileNumber(12)).toBeDefined();
  registry.destroy();
});

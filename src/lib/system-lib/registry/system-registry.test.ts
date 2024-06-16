import {
  MockGameObject,
  MockGameWorld,
  MockPackage,
  mockWorld,
} from "ttpg-mock";
import { SystemRegistry } from "./system-registry";
import { GameObject, Package, Vector, world } from "@tabletop-playground/api";

it("constructor", () => {
  new SystemRegistry();
});

it("onObjectCreated/Destroyed", () => {
  const registry = new SystemRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [{ tile: 12 }]
  );
  expect(registry.rawBySystemTileNumber(12)).toBeDefined();

  let systemTileObj: GameObject = new MockGameObject({
    id: "my-id",
    templateMetadata: "tile.system:my-source/12",
  });
  expect(registry.rawBySystemTileNumber(12)).toBeDefined();
  expect(registry.getBySystemTileObjId("my-id")).toBeDefined();

  systemTileObj.destroy();
  expect(registry.rawBySystemTileNumber(12)).toBeDefined();
  expect(registry.getBySystemTileObjId("my-id")).toBeUndefined();

  registry.destroy();
});

it("load (system tile obj exists at load time)", () => {
  let systemTileObj: GameObject = new MockGameObject({
    id: "my-id",
    templateMetadata: "tile.system:my-source/12",
  });
  const registry = new SystemRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [{ tile: 12 }]
  );
  expect(registry.rawBySystemTileNumber(12)).toBeDefined();
  expect(registry.getBySystemTileObjId("my-id")).toBeDefined();

  systemTileObj.destroy();
  expect(registry.rawBySystemTileNumber(12)).toBeDefined();
  expect(registry.getBySystemTileObjId("my-id")).toBeUndefined();

  registry.destroy();
});

it("load (duplicate system tile)", () => {
  const registry = new SystemRegistry();
  expect(registry.rawBySystemTileNumber(12)).toBeUndefined();

  // Add first.
  registry.load({ source: "base", packageId: "my-package-id" }, [
    { tile: 12, wormholes: ["alpha"] },
  ]);
  expect(registry.rawBySystemTileNumber(12)?.wormholes).toEqual(["alpha"]);

  // Add duplicate, expect ignored but non-duplicate entries still added.
  expect(() => {
    registry.load({ source: "homebrew", packageId: "my-package-id" }, [
      { tile: 11, wormholes: ["beta"] },
      { tile: 12, wormholes: ["beta"] },
      { tile: 13 },
    ]);
  }).toThrow();
  expect(registry.rawBySystemTileNumber(11)?.wormholes).toEqual(["beta"]);
  expect(registry.rawBySystemTileNumber(12)?.wormholes).toEqual(["alpha"]); // not overwritten
  expect(registry.rawBySystemTileNumber(13)).toBeUndefined(); // throw before added

  registry.destroy();
});

it("load (invalid schema)", () => {
  const registry = new SystemRegistry();
  expect(() => {
    registry.load({ source: "my-source", packageId: "my-package-id" }, [
      { tile: 12, planets: [{ name: "x", nsidName: "@@" }] },
    ]);
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
  const pos = new Vector(0, 0, z);
  const registry = new SystemRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [{ tile: 12 }]
  );
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

it("validateImages", () => {
  const registry = new SystemRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [{ tile: 12 }]
  );
  const myPackage: Package = new MockPackage({
    textureFiles: ["tile/system/my-source/tile-012.png"],
    uniqueId: "my-package-id",
  });
  mockWorld._reset({ packages: [myPackage] });
  registry.validateImages();
  registry.destroy();
});

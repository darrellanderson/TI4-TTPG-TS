import {
  MockContainer,
  MockGameObject,
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
    [{ tile: 1000 }],
  );
  expect(registry.rawBySystemTileNumber(1000)).toBeDefined();

  const systemTileObj: GameObject = new MockGameObject({
    id: "my-id",
    templateMetadata: "tile.system:my-source/1000",
  });
  expect(registry.rawBySystemTileNumber(1000)).toBeDefined();
  expect(registry.getBySystemTileObjId("my-id")).toBeDefined();

  systemTileObj.destroy();
  expect(registry.rawBySystemTileNumber(1000)).toBeDefined();
  expect(registry.getBySystemTileObjId("my-id")).toBeUndefined();

  registry.destroy();
});

it("load (system tile obj exists at load time)", () => {
  const systemTileObj: GameObject = new MockGameObject({
    id: "my-id",
    templateMetadata: "tile.system:my-source/1000",
  });
  const registry = new SystemRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [{ tile: 1000 }],
  );
  expect(registry.rawBySystemTileNumber(1000)).toBeDefined();
  expect(registry.getBySystemTileObjId("my-id")).toBeDefined();

  systemTileObj.destroy();
  expect(registry.rawBySystemTileNumber(1000)).toBeDefined();
  expect(registry.getBySystemTileObjId("my-id")).toBeUndefined();

  registry.destroy();
});

it("load (duplicate system tile)", () => {
  const registry = new SystemRegistry();
  expect(registry.rawBySystemTileNumber(12)).toBeUndefined();

  // Add first.
  registry.load({ source: "base", packageId: "my-package-id" }, [
    { tile: 1002, wormholes: ["alpha"] },
  ]);
  expect(registry.rawBySystemTileNumber(1002)?.wormholes).toEqual(["alpha"]);

  // Add duplicate, expect ignored but non-duplicate entries still added.
  expect(() => {
    registry.load({ source: "homebrew", packageId: "my-package-id" }, [
      { tile: 1001, wormholes: ["beta"] },
      { tile: 1002, wormholes: ["beta"] },
      { tile: 1003 },
    ]);
  }).toThrow();
  expect(registry.rawBySystemTileNumber(1001)?.wormholes).toEqual(["beta"]);
  expect(registry.rawBySystemTileNumber(1002)?.wormholes).toEqual(["alpha"]); // not overwritten
  expect(registry.rawBySystemTileNumber(1003)).toBeUndefined(); // throw before added

  registry.destroy();
});

it("load (invalid schema)", () => {
  const registry = new SystemRegistry();
  expect(() => {
    registry.load({ source: "my-source", packageId: "my-package-id" }, [
      { tile: 1000, planets: [{ name: "x", nsidName: "@@" }] },
    ]);
  }).toThrow();
  registry.destroy();
});

it("loadDefaultData", () => {
  const registry = new SystemRegistry();
  expect(registry.rawBySystemTileNumber(1)).toBeUndefined();
  registry.loadDefaultData();
  expect(registry.rawBySystemTileNumber(1)).toBeDefined();
  registry.destroy();
});

it("getAllSystemsWithObjs", () => {
  const registry = new SystemRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [{ tile: 1000 }],
  );
  const obj = new MockGameObject({
    id: "my-id-1",
    templateMetadata: "tile.system:my-source/1000",
  });
  new MockGameObject({
    id: "my-id-2",
    templateMetadata: "tile.system:my-source/1000",
    container: new MockContainer(),
  });
  expect(registry.getAllSystemsWithObjs()).toHaveLength(2);
  expect(registry.getAllSystemsWithObjs(true)).toHaveLength(1); // skip contained
  obj.destroy();
  expect(obj.isValid()).toBeFalsy();
  expect(registry.getAllSystemsWithObjs()).toHaveLength(1);
  registry.destroy();
});

it("getByPosition", () => {
  const z: number = world.getTableHeight();
  const pos = new Vector(0, 0, z);
  const registry = new SystemRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [{ tile: 1000 }],
  );
  expect(registry.getByPosition(pos)).toBeUndefined();

  const obj = new MockGameObject({
    id: "my-id",
    position: pos,
    templateMetadata: "tile.system:my-source/1000",
  });
  expect(registry.getByPosition(pos)).toBeDefined();

  obj.destroy();
  expect(registry.getByPosition(pos)).toBeUndefined();
  registry.destroy();
});

it("tileNumberToSystemTileObjNsid", () => {
  const registry = new SystemRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [{ tile: 1000 }],
  );
  let nsid: string | undefined;

  nsid = registry.tileNumberToSystemTileObjNsid(1000);
  expect(nsid).toEqual("tile.system:my-source/1000");

  nsid = registry.tileNumberToSystemTileObjNsid(999);
  expect(nsid).toBeUndefined();

  registry.destroy();
});

it("validateImages", () => {
  const registry = new SystemRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [{ tile: 12, imgFaceDown: true }, { tile: -1 }],
  );
  const myPackage: Package = new MockPackage({
    textureFiles: [
      "tile/system/tile-012.png",
      "tile/system/tile-012.back.png",
      "tile/system/tile-012.jpg",
      "tile/system/tile-012.back.jpg",
    ],
    uniqueId: "my-package-id",
  });
  mockWorld._reset({ packages: [myPackage] });
  registry.validateImages();
  registry.validateImages(true);
  registry.destroy();
});

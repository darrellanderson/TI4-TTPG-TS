import { MockGameObject } from "ttpg-mock";
import { SystemRegistry } from "./system-registry";

it("static _getTileNumberFromObj (not tile)", () => {
  const nsid = "not-a-tile";
  const tileNumber = undefined;
  const obj = new MockGameObject({ templateMetadata: nsid });
  expect(SystemRegistry._getTileNumberFromObj(obj)).toBe(tileNumber);
});

it("static _getTileNumberFromObj (invalid nsid)", () => {
  const nsid = "tile.system;;bad-format";
  const tileNumber = undefined;
  const obj = new MockGameObject({ templateMetadata: nsid });
  expect(SystemRegistry._getTileNumberFromObj(obj)).toBe(tileNumber);
});

it("static _getTileNumberFromObj (tile not a number)", () => {
  const nsid = "tile.system:base/abc";
  const tileNumber = undefined;
  const obj = new MockGameObject({ templateMetadata: nsid });
  expect(SystemRegistry._getTileNumberFromObj(obj)).toBe(tileNumber);
});

it("static _getTileNumberFromObj", () => {
  const nsid = "tile.system:base/12";
  const tileNumber = 12;
  const obj = new MockGameObject({ templateMetadata: nsid });
  expect(SystemRegistry._getTileNumberFromObj(obj)).toBe(tileNumber);
});

it("constructor", () => {
  new SystemRegistry();
});

it("onObjectCreated/Destroyed", () => {
  const registry = new SystemRegistry().loadOrThrow([
    { tile: 12, source: "base" },
  ]);
  const system = registry.getByTileNumber(12);
  expect(registry.getByTileObjId("my-id")).toBeUndefined();
  expect(system?.getSystemTileObjId()).toBeUndefined();

  let obj = new MockGameObject({
    id: "my-id",
    templateMetadata: "tile.system:base/12",
  });
  expect(registry.getByTileObjId("my-id")).toBe(system);
  expect(system?.getSystemTileObjId()).toBe("my-id");

  obj.destroy();
  expect(registry.getByTileObjId("my-id")).toBeUndefined();
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
    templateMetadata: "tile.system:base/12",
  });
  const registry = new SystemRegistry().loadOrThrow([
    { tile: 12, source: "base" },
  ]);
  const system = registry.getByTileNumber(12);
  expect(system?.getSystemTileObjId()).toBe("my-id");
  registry.destroy();
});

it("load (duplicate system tile)", () => {
  const mock = jest.spyOn(global.console, "error").mockImplementation(() => {});

  const registry = new SystemRegistry();
  expect(registry.getByTileNumber(12)).toBeUndefined();

  // Add first.
  const ignored: Array<number> = [];
  registry.load([{ tile: 12, source: "base" }], ignored);
  expect(registry.getByTileNumber(12)?.getSource()).toBe("base");
  expect(ignored).toEqual([]); // no duplicates

  // Add duplicate, expect ignored but non-duplicate entries still added.
  registry.load(
    [
      { tile: 11, source: "homebrew" },
      { tile: 12, source: "homebrew" },
      { tile: 13, source: "homebrew" },
    ],
    ignored
  );
  expect(registry.getByTileNumber(11)?.getSource()).toBe("homebrew");
  expect(registry.getByTileNumber(12)?.getSource()).toBe("base"); // not overwritten
  expect(registry.getByTileNumber(13)?.getSource()).toBe("homebrew");
  expect(ignored).toEqual([12]);

  registry.destroy();
  mock.mockRestore();
});

it("loadOrThrow (duplicate system tile)", () => {
  const mock = jest.spyOn(global.console, "error").mockImplementation(() => {});

  const registry = new SystemRegistry();
  expect(registry.getByTileNumber(12)).toBeUndefined();

  // Add first.
  registry.loadOrThrow([{ tile: 12, source: "base" }]);
  expect(registry.getByTileNumber(12)?.getSource()).toBe("base");

  // Add duplicate, expect exception.
  expect(() => {
    registry.loadOrThrow([{ tile: 12, source: "homebrew" }]);
  }).toThrow("Duplicate system tile numbers: 12");

  registry.destroy();
  mock.mockRestore();
});

it("getByTileObjId (obj exists, bad nsid)", () => {
  const registry = new SystemRegistry();
  new MockGameObject({
    id: "my-id",
  });
  expect(registry.getByTileObjId("my-id")).toBeUndefined();
  registry.destroy();
});

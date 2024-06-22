import { MapStringLoad } from "./map-string-load";
import { MapStringEntry } from "./map-string-parser";
import { resetGlobalThisTI4 } from "../../global/global";
import { Spawn } from "ttpg-darrell";
import { MockContainer, MockGameObject, mockWorld } from "ttpg-mock";
import { System } from "lib/system-lib/system/system";

it("constructor", () => {
  new MapStringLoad();
});

it("_parseAndValidateMapString", () => {
  const entries: Array<MapStringEntry> | undefined =
    new MapStringLoad()._parseAndValidateMapString("{1}");
  expect(entries).toEqual([{ tile: 1 }]);
});

it("_parseAndValidateMapString (invalid)", () => {
  const entries: Array<MapStringEntry> | undefined =
    new MapStringLoad()._parseAndValidateMapString("@");
  expect(entries).toBeUndefined();
});

it("_validateSystems", () => {
  const entries: Array<MapStringEntry> = [{ tile: 1 }];
  expect(new MapStringLoad()._validateSystems(entries)).toBe(true);
});

it("_validateSystems (unknown tile number)", () => {
  resetGlobalThisTI4(); // Reset globalThis.TI4
  const entries: Array<MapStringEntry> = [{ tile: 4398 }];
  expect(new MapStringLoad()._validateSystems(entries)).toBe(false);
});

it("_validateTemplates", () => {
  Spawn.inject({ "tile.system:base/1": "my-template-id" });
  const entries: Array<MapStringEntry> = [{ tile: 1 }];
  expect(new MapStringLoad()._validateTemplates(entries)).toBe(true);
});

it("_validateTemplates (missing template)", () => {
  Spawn.clear();
  const entries: Array<MapStringEntry> = [{ tile: 1 }];
  expect(new MapStringLoad()._validateTemplates(entries)).toBe(false);
});

it("_findOrSpawnSystemTileObj (existing system)", () => {
  resetGlobalThisTI4();
  new MockGameObject({ templateMetadata: "tile.system:base/1" });
  const load: MapStringLoad = new MapStringLoad();
  expect(load._findOrSpawnSystemTileObj(1)).toBeDefined();
});

it("_findOrSpawnSystemTileObj (existing system in container)", () => {
  resetGlobalThisTI4();
  new MockGameObject({
    templateMetadata: "tile.system:base/1",
    container: new MockContainer(),
  });
  const load: MapStringLoad = new MapStringLoad();
  expect(load._findOrSpawnSystemTileObj(1)).toBeDefined();
});

it("_findOrSpawnSystemTileObj (spawn)", () => {
  resetGlobalThisTI4();
  mockWorld._reset({
    _templateIdToMockGameObjectParams: { "my-template-id": {} },
  });
  Spawn.inject({ "tile.system:base/1": "my-template-id" });
  expect(TI4.systemRegistry.tileNumberToSystemTileObjNsid(1)).toBeDefined();
  expect(Spawn.has("tile.system:base/1")).toBe(true);
  const load: MapStringLoad = new MapStringLoad();
  expect(load._findOrSpawnSystemTileObj(1)).toBeDefined();
});

it("_findOrSpawnSystemTileObj (missing tile number)", () => {
  const load: MapStringLoad = new MapStringLoad();
  expect(load._findOrSpawnSystemTileObj(4398)).toBeUndefined();
});

it("_findOrSpawnSystemTileObj (missing, bad tile)", () => {
  const load: MapStringLoad = new MapStringLoad();
  expect(load._findOrSpawnSystemTileObj(4398)).toBeUndefined();
});

it("load", () => {
  Spawn.inject({ "tile.system:base/1": "my-template-id" });
  const mapString: string = "{1}";
  const load: MapStringLoad = new MapStringLoad();
  expect(load.load(mapString)).toBe(true);
});

it("load (invalid map string)", () => {
  const mapString: string = "@@";
  const load: MapStringLoad = new MapStringLoad();
  expect(load.load(mapString)).toBe(false);
});

it("load (unknown tile number)", () => {
  const mapString: string = "{4398}";
  const load: MapStringLoad = new MapStringLoad();
  expect(load.load(mapString)).toBe(false);
});

it("load (missing template)", () => {
  Spawn.clear();
  const mapString: string = "{1}";
  const load: MapStringLoad = new MapStringLoad();
  expect(load.load(mapString)).toBe(false);
});

it("load (spawn)", () => {
  resetGlobalThisTI4();
  mockWorld._reset({
    _templateIdToMockGameObjectParams: {
      "my-template-id": { templateMetadata: "tile.system:base/1" },
    },
  });
  Spawn.inject({ "tile.system:base/1": "my-template-id" });
  const mapString: string = "{1}";
  const load: MapStringLoad = new MapStringLoad();
  expect(load.load(mapString)).toBe(true);
});

it("load (spawn with side+rot)", () => {
  resetGlobalThisTI4();
  mockWorld._reset({
    _templateIdToMockGameObjectParams: {
      "my-template-id": {
        templateMetadata: "tile.system:base/1",
      },
    },
  });
  Spawn.inject({ "tile.system:base/1": "my-template-id" });
  const mapString: string = "{1B3}";
  const load: MapStringLoad = new MapStringLoad();
  expect(load.load(mapString)).toBe(true);

  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(1)[0];
  expect(system).toBeDefined();
  if (!system) {
    throw new Error("system is undefined"); // TypeScript
  }
  expect(system.getObj().getPosition().toString()).toBe("(X=0,Y=0,Z=0)");
});

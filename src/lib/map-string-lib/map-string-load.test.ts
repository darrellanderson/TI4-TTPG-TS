import { MapStringLoad } from "./map-string-load";
import { MapStringEntry } from "./map-string-parser";
import { resetGlobalThisTI4 } from "../../global/global";
import { Spawn } from "ttpg-darrell";

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

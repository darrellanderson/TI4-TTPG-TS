import { MockGameObject } from "ttpg-mock";
import { MapPlaceFrontierTokens } from "./map-place-frontier-tokens";
import { System } from "../system-lib/system/system";

it("static _getZeroPlanetSystems", () => {
  MockGameObject.simple("tile.system:base/39");
  const systems = MapPlaceFrontierTokens._getZeroPlanetSystems();
  expect(systems.length).toBe(1);
});

it("static _placeFrontierToken", () => {
  MockGameObject.simple("tile.system:base/39");
  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(39);
  if (!system) {
    throw new Error("System not found");
  }
  MapPlaceFrontierTokens._placeFrontierToken(system);
});

it("constructor", () => {
  new MapPlaceFrontierTokens();
});

it("placeFrontierTokens", () => {
  MockGameObject.simple("tile.system:base/39");
  const mapPlaceFrontierTokens = new MapPlaceFrontierTokens();
  mapPlaceFrontierTokens.placeFrontierTokens();
});

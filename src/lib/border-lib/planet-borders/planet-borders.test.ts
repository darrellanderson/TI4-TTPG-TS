import { DrawingLine } from "@tabletop-playground/api";
import { MockCardHolder, MockGameObject } from "ttpg-mock";
import { HexType } from "ttpg-darrell";

import {
  ControlSystemType,
  SpacePlanetOwnership,
} from "../space-planet-ownership/space-planet-ownership";
import { PlanetBorders } from "./planet-borders";
import { Planet } from "../../system-lib/planet/planet";
import { System } from "../../system-lib/system/system";

it("constructor", () => {
  const hexToControlSystemEntry: Map<HexType, ControlSystemType> = new Map();
  const lineThickness: number = 1;
  const planetBorders: PlanetBorders = new PlanetBorders(
    hexToControlSystemEntry,
    lineThickness
  );
  expect(planetBorders).toBeDefined();
});

it("_getPlanetDrawingLine", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 13,
  });
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple("unit:base/infantry", {
    owningPlayerSlot: 13,
  });
  expect(TI4.playerSeats.getAllSeats().length).toBe(1);
  expect(TI4.playerSeats.getAllSeats()[0]?.playerSlot).toBe(13);

  const hexToControlSystemEntry: Map<HexType, ControlSystemType> =
    new SpacePlanetOwnership().getHexToControlSystemEntry();
  expect(hexToControlSystemEntry.size).toBe(1);
  const controlSystemType: ControlSystemType | undefined =
    hexToControlSystemEntry.get("<0,0,0>");
  expect(controlSystemType?.hex).toBe("<0,0,0>");
  expect(
    controlSystemType?.planetNameToOwningPlayerSlot.get("Mecatol Rex")
  ).toBe(13);

  const lineThickness: number = 1;
  const planetBorders: PlanetBorders = new PlanetBorders(
    hexToControlSystemEntry,
    lineThickness
  );

  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(18);
  if (!system) {
    throw new Error("System is undefined");
  }
  const planet: Planet | undefined = system.getPlanets()[0];
  if (!planet) {
    throw new Error("Planet is undefined");
  }

  const line: DrawingLine | undefined = planetBorders._getPlanetDrawingLine(
    planet,
    13
  );
  expect(line).toBeDefined();
});

it("_getPlanetDrawingLine (invalid owner)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 13,
  });
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple("unit:base/infantry", {
    owningPlayerSlot: 13,
  });
  expect(TI4.playerSeats.getAllSeats().length).toBe(1);
  expect(TI4.playerSeats.getAllSeats()[0]?.playerSlot).toBe(13);

  const hexToControlSystemEntry: Map<HexType, ControlSystemType> =
    new SpacePlanetOwnership().getHexToControlSystemEntry();
  expect(hexToControlSystemEntry.size).toBe(1);
  const controlSystemType: ControlSystemType | undefined =
    hexToControlSystemEntry.get("<0,0,0>");
  expect(controlSystemType?.hex).toBe("<0,0,0>");
  expect(
    controlSystemType?.planetNameToOwningPlayerSlot.get("Mecatol Rex")
  ).toBe(13);

  const lineThickness: number = 1;
  const planetBorders: PlanetBorders = new PlanetBorders(
    hexToControlSystemEntry,
    lineThickness
  );

  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(18);
  if (!system) {
    throw new Error("System is undefined");
  }
  const planet: Planet | undefined = system.getPlanets()[0];
  if (!planet) {
    throw new Error("Planet is undefined");
  }

  const line: DrawingLine | undefined = planetBorders._getPlanetDrawingLine(
    planet,
    2 // Invalid owner
  );
  expect(line).toBeUndefined();
});

it("_getSystemPlanetsDrawingLines", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 13,
  });
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple("unit:base/infantry", {
    owningPlayerSlot: 13,
  });
  expect(TI4.playerSeats.getAllSeats().length).toBe(1);
  expect(TI4.playerSeats.getAllSeats()[0]?.playerSlot).toBe(13);

  const hexToControlSystemEntry: Map<HexType, ControlSystemType> =
    new SpacePlanetOwnership().getHexToControlSystemEntry();
  expect(hexToControlSystemEntry.size).toBe(1);
  const controlSystemType: ControlSystemType | undefined =
    hexToControlSystemEntry.get("<0,0,0>");
  if (!controlSystemType) {
    throw new Error("ControlSystemType is undefined");
  }
  expect(controlSystemType.hex).toBe("<0,0,0>");
  expect(
    controlSystemType.planetNameToOwningPlayerSlot.get("Mecatol Rex")
  ).toBe(13);

  const lineThickness: number = 1;
  const planetBorders: PlanetBorders = new PlanetBorders(
    hexToControlSystemEntry,
    lineThickness
  );

  const lines: Array<DrawingLine> =
    planetBorders._getSystemPlanetsDrawingLines(controlSystemType);
  expect(lines.length).toBe(1);
});

it("getDrawingLines", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 13,
  });
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple("unit:base/infantry", {
    owningPlayerSlot: 13,
  });
  expect(TI4.playerSeats.getAllSeats().length).toBe(1);
  expect(TI4.playerSeats.getAllSeats()[0]?.playerSlot).toBe(13);

  const hexToControlSystemEntry: Map<HexType, ControlSystemType> =
    new SpacePlanetOwnership().getHexToControlSystemEntry();
  expect(hexToControlSystemEntry.size).toBe(1);
  const controlSystemType: ControlSystemType | undefined =
    hexToControlSystemEntry.get("<0,0,0>");
  if (!controlSystemType) {
    throw new Error("ControlSystemType is undefined");
  }
  expect(controlSystemType.hex).toBe("<0,0,0>");
  expect(
    controlSystemType.planetNameToOwningPlayerSlot.get("Mecatol Rex")
  ).toBe(13);

  const lineThickness: number = 1;
  const planetBorders: PlanetBorders = new PlanetBorders(
    hexToControlSystemEntry,
    lineThickness
  );

  const lines: Array<DrawingLine> = planetBorders.getDrawingLines();
  expect(lines.length).toBe(1);
});

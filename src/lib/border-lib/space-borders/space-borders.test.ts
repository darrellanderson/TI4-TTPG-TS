import { HexType } from "ttpg-darrell";
import {
  ControlSystemType,
  SpacePlanetOwnership,
} from "../space-planet-ownership/space-planet-ownership";
import { SpaceBorders } from "./space-borders";
import { MockCardHolder, MockGameObject } from "ttpg-mock";

it("constructor", () => {
  const hexToControlSystemEntry: Map<HexType, ControlSystemType> = new Map();
  const lineThickness: number = 1;
  const spaceBorders: SpaceBorders = new SpaceBorders(
    hexToControlSystemEntry,
    lineThickness
  );
  expect(spaceBorders).toBeDefined();
});

it("_getLineSegments", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 13,
  });
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple("unit:base/fighter", {
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
  expect(controlSystemType?.spaceOwningPlayerSlot).toBe(13);

  const lineThickness: number = 1;
  const spaceBorders: SpaceBorders = new SpaceBorders(
    hexToControlSystemEntry,
    lineThickness
  );

  const lineSegments = spaceBorders._getLineSegments(13);
  expect(lineSegments.length).toBe(6); // one for each hex edge
});

it("_getPolygons", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 13,
  });
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple("unit:base/fighter", {
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
  expect(controlSystemType?.spaceOwningPlayerSlot).toBe(13);

  const lineThickness: number = 1;
  const spaceBorders: SpaceBorders = new SpaceBorders(
    hexToControlSystemEntry,
    lineThickness
  );

  const polygons = spaceBorders._getPolygons(13);
  expect(polygons.length).toBe(1); // hex edges conjoined
});

it("_getDrawingLinesByOwner", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 13,
  });
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple("unit:base/fighter", {
    owningPlayerSlot: 13,
  });
  expect(TI4.playerSeats.getAllSeats().length).toBe(1);
  expect(TI4.playerSeats.getAllSeats()[0]?.playerSlot).toBe(13);
  expect(TI4.playerColor.getSlotWidgetColor(13)).toBeDefined();

  const hexToControlSystemEntry: Map<HexType, ControlSystemType> =
    new SpacePlanetOwnership().getHexToControlSystemEntry();
  expect(hexToControlSystemEntry.size).toBe(1);
  const controlSystemType: ControlSystemType | undefined =
    hexToControlSystemEntry.get("<0,0,0>");
  expect(controlSystemType?.hex).toBe("<0,0,0>");
  expect(controlSystemType?.spaceOwningPlayerSlot).toBe(13);

  const lineThickness: number = 1;
  const spaceBorders: SpaceBorders = new SpaceBorders(
    hexToControlSystemEntry,
    lineThickness
  );

  const drawingLines = spaceBorders._getDrawingLinesByOwner(13);
  expect(drawingLines.length).toBe(1);
});

it("_getDrawingLinesByOwner (invalid owner)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 13,
  });
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple("unit:base/fighter", {
    owningPlayerSlot: 13,
  });
  expect(TI4.playerSeats.getAllSeats().length).toBe(1);
  expect(TI4.playerSeats.getAllSeats()[0]?.playerSlot).toBe(13);
  expect(TI4.playerColor.getSlotWidgetColor(13)).toBeDefined();

  const hexToControlSystemEntry: Map<HexType, ControlSystemType> =
    new SpacePlanetOwnership().getHexToControlSystemEntry();
  expect(hexToControlSystemEntry.size).toBe(1);
  const controlSystemType: ControlSystemType | undefined =
    hexToControlSystemEntry.get("<0,0,0>");
  expect(controlSystemType?.hex).toBe("<0,0,0>");
  expect(controlSystemType?.spaceOwningPlayerSlot).toBe(13);

  const lineThickness: number = 1;
  const spaceBorders: SpaceBorders = new SpaceBorders(
    hexToControlSystemEntry,
    lineThickness
  );

  const drawingLines = spaceBorders._getDrawingLinesByOwner(2);
  expect(drawingLines.length).toBe(0);
});

it("getDrawingLines", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 13,
  });
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple("tile.system:base/19", {
    position: TI4.hex.toPosition("<1,0,-1>"),
  }); // second, adjacent system
  MockGameObject.simple("unit:base/fighter", {
    owningPlayerSlot: 13,
  });
  expect(TI4.playerSeats.getAllSeats().length).toBe(1);
  expect(TI4.playerSeats.getAllSeats()[0]?.playerSlot).toBe(13);

  const hexToControlSystemEntry: Map<HexType, ControlSystemType> =
    new SpacePlanetOwnership().getHexToControlSystemEntry();
  expect(hexToControlSystemEntry.size).toBe(2);
  const controlSystemType: ControlSystemType | undefined =
    hexToControlSystemEntry.get("<0,0,0>");
  expect(controlSystemType?.hex).toBe("<0,0,0>");
  expect(controlSystemType?.spaceOwningPlayerSlot).toBe(13);

  const lineThickness: number = 1;
  const spaceBorders: SpaceBorders = new SpaceBorders(
    hexToControlSystemEntry,
    lineThickness
  );
  const drawingLines = spaceBorders.getDrawingLines();
  expect(drawingLines.length).toBe(1);
});

it("getDrawingLines (empty)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 13,
  });
  MockGameObject.simple("tile.system:base/18");

  const hexToControlSystemEntry: Map<HexType, ControlSystemType> =
    new SpacePlanetOwnership().getHexToControlSystemEntry();
  const lineThickness: number = 1;
  const spaceBorders: SpaceBorders = new SpaceBorders(
    hexToControlSystemEntry,
    lineThickness
  );
  const drawingLines = spaceBorders.getDrawingLines();
  expect(drawingLines.length).toBe(0);
});

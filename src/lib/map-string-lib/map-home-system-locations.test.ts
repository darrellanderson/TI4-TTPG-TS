import { Vector } from "@tabletop-playground/api";
import { MapHomeSystemLocations } from "./map-home-system-locations";
import { MockCardHolder, MockGameObject } from "ttpg-mock";

it("constructor", () => {
  new MapHomeSystemLocations();
});

it("get", () => {
  const playerSlot: number = 10;

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
  });

  const mapHomeSystemLocations: MapHomeSystemLocations =
    new MapHomeSystemLocations();
  const result: Vector | undefined = mapHomeSystemLocations.get(playerSlot);
  expect(result).toBeDefined();
});

it("get (unknown player slot)", () => {
  const playerSlot: number = 1;

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const mapHomeSystemLocations: MapHomeSystemLocations =
    new MapHomeSystemLocations();
  const result: Vector | undefined = mapHomeSystemLocations.get(playerSlot);
  expect(result).toBeUndefined();
});

it("findExistingGenericHomeSystem", () => {
  const playerSlot: number = 10;

  new MockGameObject({
    templateMetadata: "tile.system:base/0",
    owningPlayerSlot: playerSlot,
  });

  const mapHomeSystemLocations: MapHomeSystemLocations =
    new MapHomeSystemLocations();
  const result =
    mapHomeSystemLocations.findExistingGenericHomeSystem(playerSlot);
  expect(result).toBeDefined();
});

it("findExistingGenericHomeSystem (missing)", () => {
  const playerSlot: number = 10;

  const mapHomeSystemLocations: MapHomeSystemLocations =
    new MapHomeSystemLocations();
  const result =
    mapHomeSystemLocations.findExistingGenericHomeSystem(playerSlot);
  expect(result).toBeUndefined();
});

it("spawnGenericHomeSystem", () => {
  const playerSlot: number = 10;

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
  });

  const mapHomeSystemLocations: MapHomeSystemLocations =
    new MapHomeSystemLocations();
  const result = mapHomeSystemLocations.spawnGenericHomeSystem(playerSlot);
  expect(result).toBeDefined();
});

it("spawnGenericHomeSystem (no player seat)", () => {
  const playerSlot: number = 10;

  const mapHomeSystemLocations: MapHomeSystemLocations =
    new MapHomeSystemLocations();
  const result = mapHomeSystemLocations.spawnGenericHomeSystem(playerSlot);
  expect(result).toBeUndefined();
});

it("findOrSpawnGenericHomeSystemOrThrow (find)", () => {
  const playerSlot: number = 10;

  new MockGameObject({
    templateMetadata: "tile.system:base/0",
    owningPlayerSlot: playerSlot,
  });

  const mapHomeSystemLocations: MapHomeSystemLocations =
    new MapHomeSystemLocations();
  const result =
    mapHomeSystemLocations.findOrSpawnGenericHomeSystemOrThrow(playerSlot);
  expect(result).toBeDefined();
});

it("findOrSpawnGenericHomeSystemOrThrow (spawn)", () => {
  const playerSlot: number = 10;

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
  });

  const mapHomeSystemLocations: MapHomeSystemLocations =
    new MapHomeSystemLocations();
  const result =
    mapHomeSystemLocations.findOrSpawnGenericHomeSystemOrThrow(playerSlot);
  expect(result).toBeDefined();
});

it("findOrSpawnGenericHomeSystemOrThrow (error)", () => {
  const playerSlot: number = 10;

  const mapHomeSystemLocations: MapHomeSystemLocations =
    new MapHomeSystemLocations();
  expect(() => {
    mapHomeSystemLocations.findOrSpawnGenericHomeSystemOrThrow(playerSlot);
  }).toThrow();
});

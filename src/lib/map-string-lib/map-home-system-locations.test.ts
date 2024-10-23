import { Vector } from "@tabletop-playground/api";
import { MapHomeSystemLocations } from "./map-home-system-locations";
import { MockCardHolder } from "ttpg-mock";

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

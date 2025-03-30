import { Card, GameObject, SnapPoint } from "@tabletop-playground/api";
import { MockCard, MockGameObject, MockSnapPoint } from "ttpg-mock";
import { FindPlayerTechDeck } from "./find-player-tech-deck";

it("getTechDeckOrThrow", () => {
  const playerSlot: number = 10;

  const techDeck: Card = new MockCard();
  const snapPoint: SnapPoint = new MockSnapPoint({
    tags: ["deck-technology"],
    snappedObject: techDeck,
  });
  new MockGameObject({
    templateMetadata: "mat.player:base/technology-deck",
    owningPlayerSlot: playerSlot,
    snapPoints: [snapPoint],
  });

  const findPlayerTechDeck = new FindPlayerTechDeck();
  const result: Card = findPlayerTechDeck.getTechDeckOrThrow(playerSlot);
  expect(result).toBe(techDeck);
});

it("_getTechDeckOrThrow (missing snap point)", () => {
  const playerSlot: number = 10;

  const findPlayerTechDeck = new FindPlayerTechDeck();
  expect(() => {
    findPlayerTechDeck.getTechDeckOrThrow(playerSlot);
  }).toThrow(/no snap point/);
});

it("_getTechDeckOrThrow (no snapped object)", () => {
  const playerSlot: number = 10;

  const snapPoint: SnapPoint = new MockSnapPoint({
    tags: ["deck-technology"],
  });
  new MockGameObject({
    templateMetadata: "mat.player:base/technology-deck",
    owningPlayerSlot: playerSlot,
    snapPoints: [snapPoint],
  });

  const findPlayerTechDeck = new FindPlayerTechDeck();
  expect(() => {
    findPlayerTechDeck.getTechDeckOrThrow(playerSlot);
  }).toThrow(/no snapped object/);
});

it("_getTechDeckOrThrow (snapped object not a card)", () => {
  const playerSlot: number = 10;

  const snappedObject: GameObject = new MockGameObject();
  const snapPoint: SnapPoint = new MockSnapPoint({
    tags: ["deck-technology"],
    snappedObject: snappedObject,
  });
  new MockGameObject({
    templateMetadata: "mat.player:base/technology-deck",
    owningPlayerSlot: playerSlot,
    snapPoints: [snapPoint],
  });

  const findPlayerTechDeck = new FindPlayerTechDeck();
  expect(() => {
    findPlayerTechDeck.getTechDeckOrThrow(playerSlot);
  }).toThrow(/not a card/);
});

it("_getTechDeck (missing snap point)", () => {
  const playerSlot: number = 10;
  const findPlayerTechDeck = new FindPlayerTechDeck();
  const result: Card | undefined = findPlayerTechDeck.getTechDeck(playerSlot);
  expect(result).toBeUndefined();
});

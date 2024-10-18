import { Card, Vector } from "@tabletop-playground/api";
import { MockCard, MockCardHolder, MockGameObject } from "ttpg-mock";

import { PlaceControlTokenOnCard } from "./place-control-token-on-card";

it("constructor", () => {
  new PlaceControlTokenOnCard();
});

it("place (no seat)", () => {
  const placeControlTokenOnCard: PlaceControlTokenOnCard =
    new PlaceControlTokenOnCard();
  const card: Card = new MockCard();
  let success: boolean;

  success = placeControlTokenOnCard.place(card, 10);
  expect(success).toBe(false);

  // Set up faction.
  new MockGameObject({
    templateMetadata: "sheet.faction:base/arborec",
    owningPlayerSlot: 10,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  expect(TI4.factionRegistry.getByPlayerSlot(10)).toBeDefined();

  success = placeControlTokenOnCard.place(card, 10);
  expect(success).toBe(true);
});

it("_computePos (missing seat)", () => {
  const placeControlTokenOnCard: PlaceControlTokenOnCard =
    new PlaceControlTokenOnCard();
  const card: Card = new MockCard();
  const center: Vector = card.getPosition();

  const pos: Vector = placeControlTokenOnCard._computePos(center, 3);
  expect(pos.toString()).toBe("(X=0,Y=0,Z=10)");
});

it("_computePos (odd seat)", () => {
  const placeControlTokenOnCard: PlaceControlTokenOnCard =
    new PlaceControlTokenOnCard();
  const card: Card = new MockCard();
  const center: Vector = card.getPosition();

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const pos: Vector = placeControlTokenOnCard._computePos(center, 10);
  expect(pos.toString()).toBe("(X=0,Y=1.5,Z=10)");
});

it("_computePos (even seat)", () => {
  const placeControlTokenOnCard: PlaceControlTokenOnCard =
    new PlaceControlTokenOnCard();
  const card: Card = new MockCard();
  const center: Vector = card.getPosition();

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 2,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const pos: Vector = placeControlTokenOnCard._computePos(center, 10);
  expect(pos.toString()).toBe("(X=0,Y=-1.5,Z=10)");
});

import { Card, Vector } from "@tabletop-playground/api";
import { MockCard, MockCardHolder, MockGameObject } from "ttpg-mock";

import { PlaceControlTokenOnCard } from "./place-control-token-on-card";

import { addObjectTemplatesToMockWorld } from "../../nsid/nsid-to-template-id.test";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("constructor", () => {
  new PlaceControlTokenOnCard();
});

it("place (no seat)", () => {
  const placeControlTokenOnCard: PlaceControlTokenOnCard =
    new PlaceControlTokenOnCard();
  const card: Card = new MockCard();
  let success: boolean;

  success = placeControlTokenOnCard.place(card, 3);
  expect(success).toBe(false);

  // Set up faction.
  new MockGameObject({
    templateMetadata: "sheet.faction:base/arborec",
    owningPlayerSlot: 3,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 3,
  });
  expect(TI4.factionRegistry.getByPlayerSlot(3)).toBeDefined();

  success = placeControlTokenOnCard.place(card, 3);
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
    owningPlayerSlot: 3,
  });

  const pos: Vector = placeControlTokenOnCard._computePos(center, 3);
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
    owningPlayerSlot: 3,
  });

  const pos: Vector = placeControlTokenOnCard._computePos(center, 3);
  expect(pos.toString()).toBe("(X=0,Y=-1.5,Z=10)");
});

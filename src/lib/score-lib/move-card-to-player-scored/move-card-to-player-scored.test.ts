import { Card } from "@tabletop-playground/api";
import { MockCard, MockCardHolder } from "ttpg-mock";

import { MoveCardToPlayerScored } from "./move-card-to-player-scored";

it("constructor", () => {
  new MoveCardToPlayerScored();
});

it("moveCard", () => {
  const moveCardToPlayerScored: MoveCardToPlayerScored =
    new MoveCardToPlayerScored();
  const card: Card = new MockCard();
  const playerSlot: number = 1;

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-scoring",
    owningPlayerSlot: playerSlot,
  });

  expect(moveCardToPlayerScored.moveCard(card, playerSlot)).toBe(true);
});

it("moveCard (no card holder)", () => {
  const moveCardToPlayerScored: MoveCardToPlayerScored =
    new MoveCardToPlayerScored();
  const card: Card = new MockCard();
  const playerSlot: number = 1;

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-scoring",
  });

  expect(moveCardToPlayerScored.moveCard(card, playerSlot)).toBe(false);
});

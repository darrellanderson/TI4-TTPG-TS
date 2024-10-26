import { MockCard, MockCardDetails, MockCardHolder } from "ttpg-mock";
import { PlaceGenericPromissories } from "./place-generic-promissories";
import { Card } from "@tabletop-playground/api";

it("place", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  new PlaceGenericPromissories(10).place();
});

it("_getGenericPromissoryCards", () => {
  const place = new PlaceGenericPromissories(10);
  const deck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({ metadata: "card.promissory.green:base/ceasefire" }),
      new MockCardDetails({ metadata: "card.promissory.other:base/other" }),
    ],
  });
  const colorName: string = "green";
  expect(deck.getStackSize()).toBe(2);

  const cards: Array<Card> = place._getGenericPromissoryCards(deck, colorName);
  expect(cards.length).toBe(1);
  expect(deck.getStackSize()).toBe(1);
});

it("_placeCards", () => {
  const place = new PlaceGenericPromissories(10);
  const cardHolder = new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  const cards: Array<Card> = [new MockCard(), new MockCard()];
  expect(cardHolder.getNumCards()).toBe(0);

  place._placeCards(cardHolder, cards);
  expect(cardHolder.getNumCards()).toBe(2);
});

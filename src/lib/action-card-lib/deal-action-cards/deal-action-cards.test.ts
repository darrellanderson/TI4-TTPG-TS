import {
  MockCard,
  MockCardHolder,
  MockGameObject,
  MockSnapPoint,
} from "ttpg-mock";
import { DealActionCards } from "./deal-action-cards";
import { Card, CardHolder } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

it("constructor", () => {
  new DealActionCards();
});

it("getPlayerSlotToActionCardCount (default)", () => {
  new MockCardHolder({ owningPlayerSlot: 1, position: [10, 0, 0] });
  const slotToCount: Map<number, number> =
    new DealActionCards().getPlayerSlotToActionCardCount();
  expect(slotToCount.get(1)).toBe(1);
});

it("getPlayerSlotToActionCardCount (scheming, neural-motivator)", () => {
  new MockCardHolder({ owningPlayerSlot: 1, position: [10, 0, 0] });
  new MockGameObject({
    templateMetadata: "sheet.faction:base/yssaril", // scheming
    position: [10, 0, 0],
    owningPlayerSlot: 1,
  });
  MockCard.simple("card.technology.green:base/neural-motivator", {
    position: [10, 0, 0],
  });

  const slotToCount: Map<number, number> =
    new DealActionCards().getPlayerSlotToActionCardCount();
  expect(slotToCount.get(1)).toBe(3);
});

it("dealAllActionCards", () => {
  new MockCardHolder({ owningPlayerSlot: 1, position: [10, 0, 0] });
  const tooFewCards: Set<number> = new DealActionCards().dealAllActionCards();
  expect(tooFewCards.size).toBe(1);
});

it("dealActionCards", () => {
  const holder1: CardHolder = new MockCardHolder({
    owningPlayerSlot: 1,
    position: [10, 0, 0],
  });
  const holder2: CardHolder = new MockCardHolder({
    owningPlayerSlot: 2,
    position: [20, 0, 0],
  });
  const holder3: CardHolder = new MockCardHolder({
    owningPlayerSlot: 3,
    position: [30, 0, 0],
  });
  const holder4: CardHolder = new MockCardHolder({
    owningPlayerSlot: 3,
    position: [30, 0, 0],
  });

  const deck: Card = MockCard.simple("card.action:base/name1");
  const deck2: Card = MockCard.simple("card.action:base/name2");
  const discard: Card = MockCard.simple("card.action:base/name3");
  deck.addCards(deck2, false); // add to bottom
  new MockGameObject({
    snapPoints: [
      new MockSnapPoint({ tags: ["deck-action"], snappedObject: deck }),
      new MockSnapPoint({ tags: ["discard-action"], snappedObject: discard }),
    ],
  });

  let success: boolean;
  const count: number = 1;

  // Find deck, deal.
  success = new DealActionCards().dealActionCards(1, count);
  expect(success).toBe(true);
  expect(holder1.getCards().map((c) => NSID.get(c))).toEqual([
    "card.action:base/name1",
  ]);
  expect(holder2.getCards()).toEqual([]);
  expect(holder3.getCards()).toEqual([]);
  expect(holder4.getCards()).toEqual([]);

  // Deck missing, find discard with two cards, deal one.
  success = new DealActionCards().dealActionCards(2, count);
  expect(success).toBe(true);
  expect(holder1.getCards().map((c) => NSID.get(c))).toEqual([
    "card.action:base/name1",
  ]);
  expect(holder2.getCards().map((c) => NSID.get(c))).toEqual([
    "card.action:base/name2",
  ]);
  expect(holder3.getCards().map((c) => NSID.get(c))).toEqual([]);
  expect(holder4.getCards().map((c) => NSID.get(c))).toEqual([]);

  // Deck missing, find discard with one cards, deal.
  success = new DealActionCards().dealActionCards(3, count);
  expect(success).toBe(true);
  expect(holder1.getCards().map((c) => NSID.get(c))).toEqual([
    "card.action:base/name1",
  ]);
  expect(holder2.getCards().map((c) => NSID.get(c))).toEqual([
    "card.action:base/name2",
  ]);
  expect(holder3.getCards().map((c) => NSID.get(c))).toEqual([
    "card.action:base/name3",
  ]);
  expect(holder4.getCards().map((c) => NSID.get(c))).toEqual([]);

  // Deck and discard missing, fail.
  success = new DealActionCards().dealActionCards(4, count);
  expect(success).toBe(false);
  expect(holder1.getCards().map((c) => NSID.get(c))).toEqual([
    "card.action:base/name1",
  ]);
  expect(holder2.getCards().map((c) => NSID.get(c))).toEqual([
    "card.action:base/name2",
  ]);
  expect(holder3.getCards().map((c) => NSID.get(c))).toEqual([
    "card.action:base/name3",
  ]);
  expect(holder4.getCards().map((c) => NSID.get(c))).toEqual([]);
});

it("dealActionCards (missing deck)", () => {
  new MockCardHolder({ owningPlayerSlot: 1, position: [10, 0, 0] });
  const success: boolean = new DealActionCards().dealActionCards(1, 1);
  expect(success).toBe(false);
});

it("dealActionCards (missing card holder)", () => {
  const deck: Card = MockCard.simple("card.action:base/name1");
  new MockGameObject({
    snapPoints: [
      new MockSnapPoint({ tags: ["deck-action"], snappedObject: deck }),
    ],
  });
  const success: boolean = new DealActionCards().dealActionCards(1, 1);
  expect(success).toBe(false);
});

import { Card, GameObject } from "@tabletop-playground/api";
import { SpawnMissingCards } from "./spawn-missing-cards";
import {
  MockCard,
  MockCardDetails,
  MockGameObject,
  MockSnapPoint,
} from "ttpg-mock";

it("_spawnDeck", () => {
  const spawnMissingCards = new SpawnMissingCards();
  const deckNsid = "card.action:base/0";
  const deck: Card | undefined = spawnMissingCards._spawnDeck(deckNsid);
  expect(deck).toBeDefined();
});

it("_spawnDeck (not a card)", () => {
  const spawnMissingCards = new SpawnMissingCards();
  const objNsid: string = "unit:base/carrier";
  const deck: Card | undefined = spawnMissingCards._spawnDeck(objNsid);
  expect(deck).toBeUndefined();
});

it("_getExistingDeck", () => {
  const realDeck: Card = new MockCard();
  const _mat: GameObject = new MockGameObject({
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-my-type"],
        snappedObject: realDeck,
      }),
    ],
  });

  const spawnMissingCards = new SpawnMissingCards();
  const deckNsid = "card.my-type:base/0";
  const deck: Card | undefined = spawnMissingCards._getExistingDeck(deckNsid);
  expect(deck).toBe(realDeck);
});

it("_getExistingDeck (missing)", () => {
  const spawnMissingCards = new SpawnMissingCards();
  const deckNsid = "unit:base/carrier";
  const deck: Card | undefined = spawnMissingCards._getExistingDeck(deckNsid);
  expect(deck).toBeUndefined();
});

it("_addMissingCards", () => {
  const srcDeck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.type:source/name-1",
      }),
      new MockCardDetails({
        metadata: "card.type:source/name-2",
      }),
    ],
  });
  const dstDeck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.type:source/name-1",
      }),
      new MockCardDetails({
        metadata: "card.type:source/name-3",
      }),
    ],
  });

  const spawnMissingCards = new SpawnMissingCards();
  spawnMissingCards._addMissingCards(srcDeck, dstDeck);
});

it("spawnAndAddMissingCards", () => {
  const realDeck: Card = new MockCard();
  const _mat: GameObject = new MockGameObject({
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-action"],
        snappedObject: realDeck,
      }),
    ],
  });

  const spawnMissingCards = new SpawnMissingCards();
  const deckNsid = "card.action:base/0";
  spawnMissingCards.spawnAndAddMissingCards(deckNsid);
});

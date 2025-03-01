import { Card } from "@tabletop-playground/api";
import { Find, NSID } from "ttpg-darrell";
import {
  MockCard,
  MockCardDetails,
  MockGameObject,
  MockSnapPoint,
} from "ttpg-mock";
import { MapPlacePlanetCards } from "./map-place-planet-cards";

it("constructor", () => {
  new MapPlacePlanetCards();
});

it("_getAllPlanets", () => {
  MockGameObject.simple("tile.system:base/18");
  const mapPlacePlanetCards = new MapPlacePlanetCards();
  const planets = mapPlacePlanetCards._getAllPlanets();
  expect(planets.length).toBe(1);
});

it("_getCardNsidToPlanet", () => {
  MockGameObject.simple("tile.system:pok/65");
  const mapPlacePlanetCards = new MapPlacePlanetCards();
  const nsidToPlanet = mapPlacePlanetCards._getCardNsidToPlanet();
  expect(nsidToPlanet.size).toBe(2);
  expect([...nsidToPlanet.keys()].sort()).toEqual([
    "card.legendary-planet:pok/the-atrament",
    "card.planet:pok/primor",
  ]);
});

it("_getActivePlanetsDecks", () => {
  const legednaryDeck = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.legendary-planet:pok/the-atrament",
      }),
      new MockCardDetails({
        metadata: "card.legendary-planet:pok/__some-other-legendary__",
      }),
    ],
  });
  const _legendaryMat = new MockGameObject({
    snapPoints: [
      new MockSnapPoint({
        snappedObject: legednaryDeck,
        tags: ["deck-legendary-planet"],
      }),
    ],
  });

  const planetDeck = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.planet:pok/primor",
      }),
      new MockCardDetails({
        metadata: "card.planet:pok/__some-other-planet__",
      }),
    ],
  });
  const _planetMat = new MockGameObject({
    snapPoints: [
      new MockSnapPoint({
        snappedObject: planetDeck,
        tags: ["deck-planet"],
      }),
    ],
  });

  MockGameObject.simple("tile.system:pok/65");
  const mapPlacePlanetCards = new MapPlacePlanetCards();
  const nsidToPlanet = mapPlacePlanetCards._getCardNsidToPlanet();
  const nsids = new Set<string>(nsidToPlanet.keys());
  expect(nsids.size).toBe(2);
  const decks: Array<Card> = mapPlacePlanetCards._getActivePlanetsDecks(nsids);
  expect(decks.length).toBe(2);

  const deck0: Card | undefined = decks[0];
  if (!deck0) {
    throw new Error("deck0 is undefined");
  }
  expect(NSID.getDeck(deck0)).toEqual([
    "card.legendary-planet:pok/the-atrament",
  ]);
  expect(NSID.getDeck(legednaryDeck)).toEqual([
    "card.legendary-planet:pok/__some-other-legendary__", // unused remains
  ]);

  const deck1: Card | undefined = decks[1];
  if (!deck1) {
    throw new Error("deck1 is undefined");
  }
  expect(NSID.getDeck(deck1)).toEqual(["card.planet:pok/primor"]);
  expect(NSID.getDeck(planetDeck)).toEqual([
    "card.planet:pok/__some-other-planet__", // unused remains
  ]);
});

it("placePlanetCards", () => {
  const legednaryDeck = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.legendary-planet:pok/the-atrament",
      }),
      new MockCardDetails({
        metadata: "card.legendary-planet:pok/__some-other-legendary__",
      }),
    ],
  });
  const _legendaryMat = new MockGameObject({
    snapPoints: [
      new MockSnapPoint({
        snappedObject: legednaryDeck,
        tags: ["deck-legendary-planet"],
      }),
    ],
  });

  const planetDeck = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.planet:pok/primor",
      }),
      new MockCardDetails({
        metadata: "card.planet:pok/__some-other-planet__",
      }),
    ],
  });
  const _planetMat = new MockGameObject({
    snapPoints: [
      new MockSnapPoint({
        snappedObject: planetDeck,
        tags: ["deck-planet"],
      }),
    ],
  });

  MockGameObject.simple("tile.system:pok/65");
  const mapPlacePlanetCards = new MapPlacePlanetCards();
  mapPlacePlanetCards.placePlanetCards();

  expect(NSID.getDeck(legednaryDeck)).toEqual([
    "card.legendary-planet:pok/__some-other-legendary__", // unused remains
  ]);
  expect(NSID.getDeck(planetDeck)).toEqual([
    "card.planet:pok/__some-other-planet__", // unused remains
  ]);

  const legendaryCard: Card | undefined = new Find().findCard(
    "card.legendary-planet:pok/the-atrament"
  );
  expect(legendaryCard).toBeDefined();

  const planetCard: Card | undefined = new Find().findCard(
    "card.planet:pok/primor"
  );
  expect(planetCard).toBeDefined();
});

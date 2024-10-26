import {
  MockCard,
  MockCardDetails,
  MockCardHolder,
  MockGameObject,
  MockSnapPoint,
} from "ttpg-mock";
import { Faction } from "../../faction/faction";
import { UnpackHomePlanetCards } from "./unpack-home-planet-cards";
import {
  Card,
  CardHolder,
  GameObject,
  SnapPoint,
} from "@tabletop-playground/api";

it("unpack/remove", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  // Home system tile must exist for system registry to find it.
  new MockGameObject({
    templateMetadata: "tile.system:base/5",
    owningPlayerSlot: playerSlot,
  });

  const planetDeck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.planet:base/nestphar",
      }),
      new MockCardDetails({
        metadata: "card.planet:base/_something_else_",
      }),
    ],
  });
  const snapPoint: SnapPoint = new MockSnapPoint({
    tags: ["deck-planet"],
    snappedObject: planetDeck,
  });
  const _mat: GameObject = new MockGameObject({
    snapPoints: [snapPoint],
  });

  // Cards dealt to hand holder.
  const cardHolder: CardHolder = new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
  });

  expect(cardHolder.getNumCards()).toBe(0);
  expect(planetDeck.getStackSize()).toBe(2);

  const unpack = new UnpackHomePlanetCards(faction, playerSlot);
  unpack.unpack();

  expect(cardHolder.getNumCards()).toBe(1);
  expect(planetDeck.getStackSize()).toBe(1);

  unpack.remove();

  expect(cardHolder.getNumCards()).toBe(0);
  expect(planetDeck.getStackSize()).toBe(2);
});

it("_getHomePlanetCardsNsidsOrThrow", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  // Home system tile must exist for system registry to find it.
  new MockGameObject({
    templateMetadata: "tile.system:base/5",
    owningPlayerSlot: playerSlot,
  });

  const unpack = new UnpackHomePlanetCards(faction, playerSlot);
  const nsids: Array<string> = unpack._getHomePlanetCardsNsidsOrThrow();
  expect(nsids).toEqual(["card.planet:base/nestphar"]);
});

it("_getHomePlanetCardsNsidsOrThrow (missing system)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackHomePlanetCards(faction, playerSlot);
  expect(() => {
    unpack._getHomePlanetCardsNsidsOrThrow();
  }).toThrow(/home system tile/);
});

it("_getPlanetDeckOrThrow", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const planetDeck: Card = new MockCard();
  const snapPoint: SnapPoint = new MockSnapPoint({
    tags: ["deck-planet"],
    snappedObject: planetDeck,
  });
  const _mat: GameObject = new MockGameObject({
    snapPoints: [snapPoint],
  });

  const unpack = new UnpackHomePlanetCards(faction, playerSlot);
  const found: Card = unpack._getPlanetDeckOrThrow();
  expect(found).toBe(planetDeck);
});

it("_getPlanetDeckOrThrow (missing deck)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackHomePlanetCards(faction, playerSlot);
  expect(() => {
    unpack._getPlanetDeckOrThrow();
  }).toThrow(/planet deck/);
});

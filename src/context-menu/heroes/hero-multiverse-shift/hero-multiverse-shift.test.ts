import { Card, Player } from "@tabletop-playground/api";
import { MockCard, MockGameObject, MockPlayer } from "ttpg-mock";
import { HeroMultiverseShift } from "./hero-multiverse-shift";
import { HexType } from "ttpg-darrell";

it("constructor, init", () => {
  new HeroMultiverseShift().init();
});

it("right click", () => {
  new HeroMultiverseShift().init();
  const card: MockCard = MockCard.simple(
    "card.leader.hero:pok/conservator-procyon"
  );
  process.flushTicks(); // card event delayed a frame

  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, "*Multiverse Shift");
});

it("_getZeroPlanetHexes", () => {
  MockGameObject.simple("tile.system:base/18");
  // Three zero-planet systems.
  MockGameObject.simple("tile.system:base/39", {
    position: TI4.hex.toPosition("<1,0,-1>"),
  });
  MockGameObject.simple("tile.system:base/40", {
    position: TI4.hex.toPosition("<2,0,-2>"),
  });
  MockGameObject.simple("tile.system:base/40", {
    position: TI4.hex.toPosition("<3,0,-3>"),
  });
  MockGameObject.simple("tile.system:thunders-edge/900", {
    position: TI4.hex.toPosition("<4,0,-4>"),
  });

  const heroMultiverseShift: HeroMultiverseShift = new HeroMultiverseShift();
  const zeroPlanetHexes: Set<HexType> =
    heroMultiverseShift._getZeroPlanetHexes();
  expect(zeroPlanetHexes.size).toEqual(4);
  expect(zeroPlanetHexes.has("<1,0,-1>")).toBe(true);
  expect(zeroPlanetHexes.has("<2,0,-2>")).toBe(true);
  expect(zeroPlanetHexes.has("<3,0,-3>")).toBe(true);
  expect(zeroPlanetHexes.has("<4,0,-4>")).toBe(true);
});

it("_getAlreadyHaveFrontierTokenHexes", () => {
  MockGameObject.simple("token.attachment.system:pok/frontier");
  const heroMultiverseShift: HeroMultiverseShift = new HeroMultiverseShift();
  const alreadyHaveFrontierTokenHexes: Set<HexType> =
    heroMultiverseShift._getAlreadyHaveFrontierTokenHexes();
  expect(alreadyHaveFrontierTokenHexes.size).toEqual(1);
  expect(alreadyHaveFrontierTokenHexes.has("<0,0,0>")).toBe(true);
});

it("_getShipHexes", () => {
  // Ships in two systems.
  MockGameObject.simple("unit:base/fighter", {
    owningPlayerSlot: 11,
    position: TI4.hex.toPosition("<1,0,-1>"),
  });
  MockGameObject.simple("unit:base/fighter", {
    owningPlayerSlot: 11,
    position: TI4.hex.toPosition("<2,0,-2>"),
  });

  // Non-ship in a system.
  MockGameObject.simple("unit:base/infantry", {
    owningPlayerSlot: 11,
    position: TI4.hex.toPosition("<3,0,-3>"),
  });

  const heroMultiverseShift: HeroMultiverseShift = new HeroMultiverseShift();
  const shipHexes: Set<HexType> = heroMultiverseShift._getShipHexes(11);
  expect(shipHexes.size).toEqual(2);
  expect(shipHexes.has("<1,0,-1>")).toBe(true);
  expect(shipHexes.has("<2,0,-2>")).toBe(true);
});

it("_multiverseShift", () => {
  // Three zero-planet systems.
  MockGameObject.simple("tile.system:base/39", {
    position: TI4.hex.toPosition("<1,0,-1>"),
  });
  MockGameObject.simple("tile.system:base/40", {
    position: TI4.hex.toPosition("<2,0,-2>"),
  });
  MockGameObject.simple("tile.system:base/40", {
    position: TI4.hex.toPosition("<3,0,-3>"),
  });

  // Ships in two systems.
  MockGameObject.simple("unit:base/fighter", {
    owningPlayerSlot: 11,
    position: TI4.hex.toPosition("<1,0,-1>"),
  });
  MockGameObject.simple("unit:base/fighter", {
    owningPlayerSlot: 11,
    position: TI4.hex.toPosition("<2,0,-2>"),
  });

  // Frontier token in one of the ship systems.
  MockGameObject.simple("token.attachment.system:pok/frontier", {
    position: TI4.hex.toPosition("<2,0,-2>"),
  });

  const heroMultiverseShift: HeroMultiverseShift = new HeroMultiverseShift();
  const card: Card = new MockCard();
  heroMultiverseShift._multiverseShift(card, 11);

  // Make sure new frontier token placed in the zero-planet system.
  const hexes: Set<HexType> =
    new HeroMultiverseShift()._getAlreadyHaveFrontierTokenHexes();
  expect(hexes.size).toEqual(2);
  expect(hexes.has("<1,0,-1>")).toBe(true);
  expect(hexes.has("<2,0,-2>")).toBe(true);
});

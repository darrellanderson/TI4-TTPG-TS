import { Card, GameObject, SnapPoint } from "@tabletop-playground/api";
import {
  MockCard,
  MockCardHolder,
  MockGameObject,
  MockSnapPoint,
} from "ttpg-mock";
import { AvailableVotes } from "./available-votes";
import { CardUtil, Find } from "ttpg-darrell";

// Systems must exist for registry to know about them.
beforeEach(() => {
  for (const tile of TI4.systemRegistry.getAllSystemTileNumbers()) {
    const nsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(tile);
    if (nsid) {
      MockGameObject.simple(nsid);
    }
  }
});

it("constructor", () => {
  new AvailableVotes();
});

it("_isRepresentativeGovernment (no card)", () => {
  const value: boolean = new AvailableVotes()._isRepresentativeGovernment();
  expect(value).toBe(false);
});

it("_isRepresentativeGovernment (yes)", () => {
  MockCard.simple("card.agenda:pok/representative-government");
  const value: boolean = new AvailableVotes()._isRepresentativeGovernment();
  expect(value).toBe(true);
});

it("_isRepresentativeGovernment (active agenda)", () => {
  const card: Card = MockCard.simple(
    "card.agenda:pok/representative-government"
  );

  const snapPoint: SnapPoint = new MockSnapPoint({ snappedObject: card });

  const _mat: GameObject = new MockGameObject({
    templateMetadata: "mat:base/agenda-laws",
    snapPoints: [snapPoint],
  });

  const value: boolean = new AvailableVotes()._isRepresentativeGovernment();
  expect(value).toBe(false);
});

it("_getPlayerSlotToPerPlanetBonus (empty)", () => {
  const value: Map<number, number> =
    new AvailableVotes()._getPlayerSlotToPerPlanetBonus();
  const expected: Map<number, number> = new Map();
  expect(value).toEqual(expected);
});

it("_getPlayerSlotToPerPlanetBonus (all)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    position: [-1, 0, 0],
    owningPlayerSlot: 10,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    position: [1, 0, 0],
    owningPlayerSlot: 11,
  });

  MockCard.simple("card.leader.commander.xxcha:pok/elder_qanoj", {
    position: [-1, 0, 0],
  });
  MockCard.simple("card.alliance:pok/xxcha", {
    position: [1, 0, 0],
  });

  const value: Map<number, number> =
    new AvailableVotes()._getPlayerSlotToPerPlanetBonus();
  const expected: Map<number, number> = new Map();
  expected.set(10, 1);
  expected.set(11, 1);
  expect(value).toEqual(expected);
});

it("_getPlayerSlotToPerPlanetBonus (alliance, but commander not unlocked)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    position: [-1, 0, 0],
    owningPlayerSlot: 10,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    position: [1, 0, 0],
    owningPlayerSlot: 11,
  });

  MockCard.simple("card.leader.commander.xxcha:pok/elder_qanoj", {
    position: [-1, 0, 0],
    isFaceUp: false,
  });
  MockCard.simple("card.alliance:pok/xxcha", {
    position: [1, 0, 0],
  });

  const value: Map<number, number> =
    new AvailableVotes()._getPlayerSlotToPerPlanetBonus();
  const expected: Map<number, number> = new Map();
  expect(value).toEqual(expected);
});

it("_getXxchaResInfVotes (no cards)", () => {
  const value: Set<number> = new AvailableVotes()._getXxchaResInfVotes();
  const expected: Set<number> = new Set();
  expect(value).toEqual(expected);
});

it("_getXxchaResInfVotes (hero)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockCard.simple("card.leader.hero.xxcha:codex.vigil/xxekir_grom.omega");

  const value: Set<number> = new AvailableVotes()._getXxchaResInfVotes();
  const expected: Set<number> = new Set([10]);
  expect(value).toEqual(expected);
});

it("getPlayerSlotToVotes (empty)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  const value: Map<number, number> =
    new AvailableVotes().getPlayerSlotToVotes();
  const expected: Map<number, number> = new Map();
  expected.set(10, 0);
  expect(value).toEqual(expected);
});

it("getPlayerSlotToVotes (one planet)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  const card: Card = MockCard.simple("card.planet:base/mecatol-rex");

  expect(new CardUtil().isLooseCard(card, false)).toBe(true);
  expect(
    TI4.systemRegistry.getPlanetByPlanetCardNsid("card.planet:base/mecatol-rex")
  ).toBeDefined();
  expect(new Find().closestOwnedCardHolderOwner(card.getPosition())).toBe(10);

  const value: Map<number, number> =
    new AvailableVotes().getPlayerSlotToVotes();
  const expected: Map<number, number> = new Map();
  expected.set(10, 6);
  expect(value).toEqual(expected);
});

it("getPlayerSlotToVotes (two planets)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockCard.simple("card.planet:base/mecatol-rex"); // 1/6
  MockCard.simple("card.planet:base/jord"); // 4/2

  const value: Map<number, number> =
    new AvailableVotes().getPlayerSlotToVotes();
  const expected: Map<number, number> = new Map();
  expected.set(10, 8);
  expect(value).toEqual(expected);
});

it("getPlayerSlotToVotes (two planets, representative government)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockCard.simple("card.planet:base/mecatol-rex"); // 1/6
  MockCard.simple("card.planet:base/jord"); // 4/2

  MockCard.simple("card.agenda:pok/representative-government");

  const value: Map<number, number> =
    new AvailableVotes().getPlayerSlotToVotes();
  const expected: Map<number, number> = new Map();
  expected.set(10, 1);
  expect(value).toEqual(expected);
});

it("getPlayerSlotToVotes (two planets, planet bonus)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockCard.simple("card.planet:base/mecatol-rex"); // 1/6
  MockCard.simple("card.planet:base/jord"); // 4/2

  MockCard.simple("card.leader.commander.xxcha:pok/elder_qanoj");

  const value: Map<number, number> =
    new AvailableVotes().getPlayerSlotToVotes();
  const expected: Map<number, number> = new Map();
  expected.set(10, 10);
  expect(value).toEqual(expected);
});

it("getPlayerSlotToVotes (two planets, xxcha hero omege)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockCard.simple("card.planet:base/mecatol-rex"); // 1/6
  MockCard.simple("card.planet:base/jord"); // 4/2

  MockCard.simple("card.leader.hero.xxcha:codex.vigil/xxekir_grom.omega");

  const value: Map<number, number> =
    new AvailableVotes().getPlayerSlotToVotes();
  const expected: Map<number, number> = new Map();
  expected.set(10, 13);
  expect(value).toEqual(expected);
});

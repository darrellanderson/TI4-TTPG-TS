import { Card, GameObject, SnapPoint } from "@tabletop-playground/api";
import {
  MockCard,
  MockCardHolder,
  MockGameObject,
  MockSnapPoint,
} from "ttpg-mock";
import { AvailableVotes } from "./available-votes";

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

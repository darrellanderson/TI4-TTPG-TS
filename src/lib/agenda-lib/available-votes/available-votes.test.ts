import { Card, GameObject, SnapPoint } from "@tabletop-playground/api";
import { MockCard, MockGameObject, MockSnapPoint } from "ttpg-mock";
import { AvailableVotes } from "./available-votes";

it("_isRepresentativeGovernment (no card)", () => {
  const value: boolean = AvailableVotes._isRepresentativeGovernment();
  expect(value).toBe(false);
});

it("_isRepresentativeGovernment (yes)", () => {
  MockCard.simple("card.agenda:pok/representative-government");
  const value: boolean = AvailableVotes._isRepresentativeGovernment();
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

  const value: boolean = AvailableVotes._isRepresentativeGovernment();
  expect(value).toBe(false);
});

it("constructor", () => {
  new AvailableVotes();
});

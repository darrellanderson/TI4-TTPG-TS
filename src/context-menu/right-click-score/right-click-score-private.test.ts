import { MockCard, MockGameObject, MockPlayer, MockSnapPoint } from "ttpg-mock";
import { RightClickScorePrivate } from "./right-click-score-private";
import { Card, GameObject, Player, SnapPoint } from "@tabletop-playground/api";

it("static isScorablePrivate", () => {
  let card: Card;

  card = MockCard.simple("card.objective.secret:my-source/my-name");
  expect(RightClickScorePrivate.isScorablePrivate(card)).toBe(true);

  card = MockCard.simple("card.agenda:my-source/my-name");
  expect(RightClickScorePrivate.isScorablePrivate(card)).toBe(false);

  card = MockCard.simple("card.agenda:my-source/my-name|scorable-private");
  expect(RightClickScorePrivate.isScorablePrivate(card)).toBe(true);

  card = MockCard.simple("card.promissory:my-source/support-for-the-throne");
  expect(RightClickScorePrivate.isScorablePrivate(card)).toBe(true);
});

it("init", () => {
  new RightClickScorePrivate().init();
});

it("make/split deck", () => {
  const a: MockCard = MockCard.simple("card.objective.secret:my-source/a");
  const b: MockCard = MockCard.simple("card.objective.secret:my-source/b");
  const player: Player = new MockPlayer();
  process.flushTicks();

  new RightClickScorePrivate().init();
  process.flushTicks();

  a._addCardsAsPlayer(b, undefined, undefined, undefined, undefined, player);
  expect(a.getStackSize()).toBe(2);
  process.flushTicks();

  a._takeCardsAsPlayer(1, undefined, undefined, undefined, player);
  expect(a.getStackSize()).toBe(1);
  process.flushTicks();
});

it("trigger custom action", () => {
  const card: MockCard = MockCard.simple(
    "card.objective.secret:my-source/my-name"
  );
  new RightClickScorePrivate().init();
  process.flushTicks();

  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, "*Score (private)");
});

it("score", () => {
  const card: Card = MockCard.simple("card.objective.secret:my-source/my-name");
  const player: Player = new MockPlayer({ slot: 1 });
  new RightClickScorePrivate().score(card, player);
});

it("score as public", () => {
  const card: Card = MockCard.simple("card.objective.secret:my-source/my-name");

  const snapPoint: SnapPoint = new MockSnapPoint({ snappedObject: card });
  expect(card.getSnappedToPoint()).toBe(snapPoint);

  const mat: GameObject = MockGameObject.simple("mat:base/objective-1", {
    snapPoints: [snapPoint],
  });
  expect(snapPoint.getParentObject()).toBe(mat);

  const player: Player = new MockPlayer({ slot: 1 });
  new RightClickScorePrivate().score(card, player);
});

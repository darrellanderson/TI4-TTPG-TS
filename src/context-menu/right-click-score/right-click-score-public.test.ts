import { MockCard, MockPlayer } from "ttpg-mock";
import { RightClickScorePublic } from "./right-click-score-public";
import { Card, Player } from "@tabletop-playground/api";

it("static isScorablePublic", () => {
  let card: Card;

  card = MockCard.simple("card.objective.public-1:my-source/my-name");
  expect(RightClickScorePublic.isScorablePublic(card)).toBe(true);

  card = MockCard.simple("card.objective.public-2:my-source/my-name");
  expect(RightClickScorePublic.isScorablePublic(card)).toBe(true);

  card = MockCard.simple("card.objective.secret:my-source/my-name");
  expect(RightClickScorePublic.isScorablePublic(card)).toBe(false);

  card = MockCard.simple("card.agenda:my-source/my-name");
  expect(RightClickScorePublic.isScorablePublic(card)).toBe(false);

  card = MockCard.simple("card.agenda:my-source/my-name|scorable-public");
  expect(RightClickScorePublic.isScorablePublic(card)).toBe(true);
});

it("init", () => {
  new RightClickScorePublic().init();
});

it("make/split deck", () => {
  const a: MockCard = MockCard.simple("card.objective.secret:my-source/a");
  const b: MockCard = MockCard.simple("card.objective.secret:my-source/b");
  const player: Player = new MockPlayer();
  process.flushTicks();

  new RightClickScorePublic().init();
  process.flushTicks();

  a._addCardsAsPlayer(b, undefined, undefined, undefined, undefined, player);
  expect(a.getStackSize()).toBe(2);
  process.flushTicks();

  a._takeCardsAsPlayer(1, undefined, undefined, undefined, player);
  expect(a.getStackSize()).toBe(1);
  process.flushTicks();
});

it("trigger custom action", () => {
  const card1: MockCard = MockCard.simple(
    "card.objective.public-1:my-source/my-name"
  );
  const card2: MockCard = MockCard.simple(
    "card.objective.public-2:my-source/my-name"
  );
  new RightClickScorePublic().init();
  process.flushTicks();

  const player: Player = new MockPlayer();
  card1._customActionAsPlayer(player, "*Score (public)");
  card2._customActionAsPlayer(player, "*Score (public)");
});

it("score", () => {
  const player: Player = new MockPlayer({ slot: 1 });
  const card: Card = MockCard.simple(
    "card.objective.public-1:my-source/my-name"
  );
  new RightClickScorePublic().score(card, player);
});

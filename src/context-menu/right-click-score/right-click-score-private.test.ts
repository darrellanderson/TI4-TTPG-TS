import { MockCard, MockPlayer } from "ttpg-mock";
import { RightClickScorePrivate } from "./right-click-score-private";
import { Card, Player } from "@tabletop-playground/api";

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
  const player: Player = new MockPlayer({ slot: 1 });
  const card: Card = MockCard.simple("card.objective.secret:my-source/my-name");
  new RightClickScorePrivate().score(card, player);
});

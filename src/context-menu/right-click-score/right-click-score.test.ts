import { MockCard, MockPlayer } from "ttpg-mock";
import { RightClickScore } from "./right-click-score";
import { Card, Player } from "@tabletop-playground/api";

it("init", () => {
  new RightClickScore().init();
});

it("make/split deck", () => {
  const a: MockCard = MockCard.simple("card.objective.secret:my-source/a");
  const b: MockCard = MockCard.simple("card.objective.secret:my-source/b");
  const player: Player = new MockPlayer();
  process.flushTicks();

  new RightClickScore().init();
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
  new RightClickScore().init();
  process.flushTicks();

  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, "*Score");
});

it("score", () => {
  const player: Player = new MockPlayer({ slot: 1 });
  const card: Card = MockCard.simple("card.objective.secret:my-source/my-name");
  new RightClickScore().score(card, player);
});

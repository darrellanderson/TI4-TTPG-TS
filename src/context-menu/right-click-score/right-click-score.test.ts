import {
  MockCard,
  MockCardHolder,
  MockGameObject,
  MockPlayer,
} from "ttpg-mock";
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

it("move to scoring holder", () => {
  const cardHolder = new MockCardHolder({
    templateMetadata: "card-holder:base/player-scoring",
    owningPlayerSlot: 1,
  });
  const card: Card = MockCard.simple(
    "card.objective.secret:my-source/my-name",
    {
      isHeld: true,
      cardHolder,
    }
  );
  new RightClickScore()._moveToScoringHolder(card, 1);
});

it("advance score", () => {
  MockGameObject.simple("token:base/scoreboard");
  MockGameObject.simple("token.control:base/sol", {
    owningPlayerSlot: 1,
  });

  new RightClickScore()._advanceScoreboard(1);
});

it("score", () => {
  const player: Player = new MockPlayer({ slot: 1 });
  const card: Card = MockCard.simple("card.objective.secret:my-source/my-name");
  new RightClickScore().score(card, player);
});

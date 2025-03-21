import { MockCardHolder, MockGameObject, MockPlayer } from "ttpg-mock";
import { ToggleStratCards } from "./toggle-strat-cards";
import { GameObject, Player } from "@tabletop-playground/api";

it("constructor/init", () => {
  new ToggleStratCards().init();
});

it("events", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const toggleStratCards = new ToggleStratCards();
  toggleStratCards.init();

  const strategyCard: GameObject = MockGameObject.simple(
    "tile.strategy-card:base/leadership"
  );
  const player: Player = new MockPlayer();
  TI4.events.onStrategyCardPlayed.trigger(strategyCard, player);
  TI4.events.onStrategyCardPlayed.trigger(strategyCard, player); // again
});

import { GameObject, Player } from "@tabletop-playground/api";
import {
  MockCardHolder,
  MockGameObject,
  mockGlobalEvents,
  MockPlayer,
} from "ttpg-mock";
import { ToggleStratCards } from "./toggle-strat-cards";
import { StrategyCardsState } from "../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";

it("constructor/init", () => {
  new ToggleStratCards().init();
});

it("onStrategyCardPlayed", () => {
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

it("_onCustomActionHandler", () => {
  const toggleStratCards = new ToggleStratCards();
  toggleStratCards.init();

  const actionName: string = ToggleStratCards.TOGGLE_ACTION_NAME;
  const player: Player = new MockPlayer();
  mockGlobalEvents._customActionAsPlayer(player, actionName);
  mockGlobalEvents._customActionAsPlayer(player, actionName); // again
});

it("_onStrategyCardsStateChangedHandler", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const toggleStratCards = new ToggleStratCards();
  toggleStratCards.init();

  const strategyCardsState: StrategyCardsState =
    toggleStratCards.getStrategyCardsState();

  const playerSlot: number = 10;
  const strategyCardNumber: number = 1;
  strategyCardsState.addOrUpdate(playerSlot, strategyCardNumber, "");
  strategyCardsState.remove(playerSlot, strategyCardNumber);

  strategyCardsState.addOrUpdate(playerSlot, strategyCardNumber, "");
  strategyCardsState.addOrUpdate(playerSlot, 2, "");
});

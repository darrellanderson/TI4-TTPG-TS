import { Player, Slider } from "@tabletop-playground/api";
import { PlayerSlot } from "ttpg-darrell";
import { MockPlayer, MockSlider } from "ttpg-mock";
import { BodyLeadership } from "./body-leadership";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";

it("constructor, basic getters", () => {
  const scale: number = 1;
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  );
  const playerSlot: PlayerSlot = 10;
  const body = new BodyLeadership(strategyCardsState, playerSlot);
  expect(body.isPlayingPlayer()).toBe(false);
  expect(body.getStrategyCardName()).toBe("Leadership");
  expect(body.getStrategyCardNumber()).toBe(1);
  expect(body.getBody(scale)).toBeDefined();
  expect(body.getReport()).toBeDefined();
});

it("isPlayingPlayer", () => {
  const scale: number = 1;
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  );
  const playerSlot: PlayerSlot = 10;
  strategyCardsState.setLastPlayerSlotPlayed(1, playerSlot);
  const body = new BodyLeadership(strategyCardsState, playerSlot);
  expect(body.isPlayingPlayer()).toBe(true);
  expect(body.getStrategyCardName()).toBe("Leadership");
  expect(body.getStrategyCardNumber()).toBe(1);
  expect(body.getBody(scale)).toBeDefined();
  expect(body.getReport()).toBeDefined();
});

it("load with state", () => {
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  );
  const playerSlot: PlayerSlot = 10;
  strategyCardsState.addOrUpdate(playerSlot, 1, "3");
  const body = new BodyLeadership(strategyCardsState, playerSlot);

  const slider: Slider = new MockSlider();
  const player: Player = new MockPlayer();
  const value: number = 5;
  body._onSliderChanged(slider, player, value);

  // Recreate with state.
  new BodyLeadership(strategyCardsState, playerSlot);
});

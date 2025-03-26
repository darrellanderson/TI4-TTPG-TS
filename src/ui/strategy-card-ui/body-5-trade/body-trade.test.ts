import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { BodyTrade } from "./body-trade";

it("constructor/getters", () => {
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  );
  const playerSlot: number = 10;
  const body = new BodyTrade(strategyCardsState, playerSlot);
  expect(body.getStrategyCardName()).toBe("Trade");
  expect(body.getStrategyCardNumber()).toBe(5);
  expect(body.getBody(1)).toBeUndefined();
  expect(body.getReport()).toBeUndefined();
});

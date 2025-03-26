import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { BodyImperial } from "./body-imperial";

it("constructor/getters", () => {
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  );
  const playerSlot: number = 10;
  const body = new BodyImperial(strategyCardsState, playerSlot);
  expect(body.getStrategyCardName()).toBe("Imperial");
  expect(body.getStrategyCardNumber()).toBe(8);
  expect(body.getBody(1)).toBeUndefined();
  expect(body.getReport()).toBeUndefined();
});

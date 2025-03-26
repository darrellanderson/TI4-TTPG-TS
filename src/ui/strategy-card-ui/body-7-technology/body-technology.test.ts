import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { BodyTechnology } from "./body-technology";

it("constructor/getters", () => {
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  );
  const playerSlot: number = 10;
  const body = new BodyTechnology(strategyCardsState, playerSlot);
  expect(body.getStrategyCardName()).toBe("Technology");
  expect(body.getStrategyCardNumber()).toBe(7);
  expect(body.getBody(1)).toBeUndefined();
  expect(body.getReport()).toBeUndefined();
});

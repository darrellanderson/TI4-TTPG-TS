import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { BodyConstruction } from "./body-construction";

it("constructor/getters", () => {
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  );
  const playerSlot: number = 10;
  const body = new BodyConstruction(strategyCardsState, playerSlot);
  expect(body.getStrategyCardName()).toBe("Construction");
  expect(body.getStrategyCardNumber()).toBe(4);
  expect(body.getBody(1)).toBeUndefined();
  expect(body.getReport()).toBeUndefined();
});

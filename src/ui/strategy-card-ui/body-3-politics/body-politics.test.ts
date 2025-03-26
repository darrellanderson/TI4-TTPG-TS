import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { BodyPolitics } from "./body-politics";

it("constructor/getters", () => {
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  );
  const playerSlot: number = 10;
  const body = new BodyPolitics(strategyCardsState, playerSlot);
  expect(body.getStrategyCardName()).toBe("Politics");
  expect(body.getStrategyCardNumber()).toBe(3);
  expect(body.getBody(1)).toBeUndefined();
  expect(body.getReport()).toBeUndefined();
});

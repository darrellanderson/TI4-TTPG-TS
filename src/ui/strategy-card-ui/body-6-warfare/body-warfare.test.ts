import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { BodyWarfare } from "./body-warfare";

it("constructor/getters", () => {
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  );
  const playerSlot: number = 10;
  const body = new BodyWarfare(strategyCardsState, playerSlot);
  expect(body.getStrategyCardName()).toBe("Warfare");
  expect(body.getStrategyCardNumber()).toBe(6);
  expect(body.getBody(1)).toBeUndefined();
  expect(body.getReport()).toBeUndefined();
});

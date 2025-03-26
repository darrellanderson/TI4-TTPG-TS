import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { BodyDiplomacy } from "./body-diplomacy";

it("constructor/getters", () => {
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  );
  const playerSlot: number = 10;
  const body = new BodyDiplomacy(strategyCardsState, playerSlot);
  expect(body.getStrategyCardName()).toBe("Diplomacy");
  expect(body.getStrategyCardNumber()).toBe(2);
  expect(body.getBody(1)).toBeUndefined();
  expect(body.getReport()).toBeUndefined();
});

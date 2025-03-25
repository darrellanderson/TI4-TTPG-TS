import { PlayerSlot } from "ttpg-darrell";
import { BodyLeadership } from "./body-leadership";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";

it("constructor, basic getters", () => {
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  );
  const playerSlot: PlayerSlot = 10;
  const body = new BodyLeadership(strategyCardsState, playerSlot);
  expect(body.getStrategyCardName()).toBe("Leadership");
  expect(body.getStrategyCardNumber()).toBe(1);
  expect(body.getBody()).toBeUndefined();
  expect(body.getReport()).toBeUndefined();
});

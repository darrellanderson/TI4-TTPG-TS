import { PlayerSlot } from "ttpg-darrell";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { StrategyCardsUI } from "./strategy-cards-ui";

it("constructor/destroy", () => {
  const scale: number = 1;
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  );
  const playerSlot: PlayerSlot = 10;
  new StrategyCardsUI(scale, strategyCardsState, playerSlot).destroy();
});

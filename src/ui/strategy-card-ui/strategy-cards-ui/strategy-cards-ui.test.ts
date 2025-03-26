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

it("strategy card bodies", () => {
  const scale: number = 1;
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  );
  const playerSlot: PlayerSlot = 10;
  strategyCardsState.addOrUpdate(playerSlot, 1, "");
  strategyCardsState.addOrUpdate(playerSlot, 2, "");
  strategyCardsState.addOrUpdate(playerSlot, 3, "");
  strategyCardsState.addOrUpdate(playerSlot, 4, "");
  strategyCardsState.addOrUpdate(playerSlot, 5, "");
  strategyCardsState.addOrUpdate(playerSlot, 6, "");
  strategyCardsState.addOrUpdate(playerSlot, 7, "");
  strategyCardsState.addOrUpdate(playerSlot, 8, "");

  const strategyCardsUI = new StrategyCardsUI(
    scale,
    strategyCardsState,
    playerSlot
  );
  strategyCardsUI.destroy();
});

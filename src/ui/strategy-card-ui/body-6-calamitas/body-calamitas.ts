import { AbstractStrategyCardBody } from "../abstract-strategy-card-body/abstract-strategy-card-body";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";

export class BodyCalamitas extends AbstractStrategyCardBody {
  constructor(strategyCardsState: StrategyCardsState, playerSlot: number) {
    super(strategyCardsState, -6, playerSlot);
  }

  getStrategyCardName(): string {
    return "Calamitas";
  }

  getBody(_scale: number): AbstractUI | undefined {
    return undefined;
  }

  getReport(): string | undefined {
    return undefined;
  }
}

import { AbstractStrategyCardBody } from "../abstract-strategy-card-body/abstract-strategy-card-body";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";

export class BodyNoctis extends AbstractStrategyCardBody {
  constructor(strategyCardsState: StrategyCardsState, playerSlot: number) {
    super(strategyCardsState, -2, playerSlot);
  }

  getStrategyCardName(): string {
    return "Noctis";
  }

  getBody(_scale: number): AbstractUI | undefined {
    return undefined;
  }

  getReport(): string | undefined {
    return undefined;
  }
}

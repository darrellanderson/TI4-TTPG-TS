import { StrategyCardsState } from "lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { AbstractStrategyCardBody } from "../abstract-strategy-card-body/abstract-strategy-card-body";

export class BodyLeadership extends AbstractStrategyCardBody {
  constructor(strategyCardsState: StrategyCardsState, playerSlot: number) {
    super(strategyCardsState, 1, playerSlot);
  }

  getStrategyCardName(): string {
    return "Leadership";
  }

  getStrategyCardNumber(): number {
    return 1;
  }

  getBody(): AbstractUI | undefined {
    return undefined;
  }

  getReport(): string | undefined {
    return undefined;
  }
}

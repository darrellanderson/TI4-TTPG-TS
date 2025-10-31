import { AbstractStrategyCardBody } from "../abstract-strategy-card-body/abstract-strategy-card-body";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";

export class BodyTyrannus extends AbstractStrategyCardBody {
  constructor(strategyCardsState: StrategyCardsState, playerSlot: number) {
    super(strategyCardsState, -3, playerSlot);
  }

  getStrategyCardName(): string {
    return "Tryannus";
  }

  getBody(_scale: number): AbstractUI | undefined {
    return undefined;
  }

  getReport(): string | undefined {
    return undefined;
  }
}

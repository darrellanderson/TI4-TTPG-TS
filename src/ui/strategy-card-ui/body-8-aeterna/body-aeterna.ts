import { AbstractStrategyCardBody } from "../abstract-strategy-card-body/abstract-strategy-card-body";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";

export class BodyAeterna extends AbstractStrategyCardBody {
  constructor(strategyCardsState: StrategyCardsState, playerSlot: number) {
    super(strategyCardsState, -8, playerSlot);
  }

  getStrategyCardName(): string {
    return "Aeterna";
  }

  getBody(_scale: number): AbstractUI | undefined {
    return undefined;
  }

  getReport(): string | undefined {
    return undefined;
  }
}

import { AbstractStrategyCardBody } from "../abstract-strategy-card-body/abstract-strategy-card-body";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
export declare class BodyTechnology extends AbstractStrategyCardBody {
    private readonly _onChooseTechButtonClicked;
    constructor(strategyCardsState: StrategyCardsState, playerSlot: number);
    getStrategyCardName(): string;
    getBody(scale: number): AbstractUI | undefined;
    getReport(): string | undefined;
}

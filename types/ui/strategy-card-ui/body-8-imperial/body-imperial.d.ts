import { AbstractStrategyCardBody } from "../abstract-strategy-card-body/abstract-strategy-card-body";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
export declare class BodyImperial extends AbstractStrategyCardBody {
    constructor(strategyCardsState: StrategyCardsState, playerSlot: number);
    getStrategyCardName(): string;
    getBody(_scale: number): AbstractUI | undefined;
    getReport(): string | undefined;
}

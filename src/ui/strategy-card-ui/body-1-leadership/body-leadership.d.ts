import { Player, Slider } from "@tabletop-playground/api";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { AbstractStrategyCardBody } from "../abstract-strategy-card-body/abstract-strategy-card-body";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
export declare class BodyLeadership extends AbstractStrategyCardBody {
    private _tokenCount;
    readonly _onSliderChanged: (_slider: Slider, _player: Player, value: number) => void;
    constructor(strategyCardsState: StrategyCardsState, playerSlot: number);
    getStrategyCardName(): string;
    getBody(scale: number): AbstractUI | undefined;
    getReport(): string | undefined;
}

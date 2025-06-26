import { Button } from "@tabletop-playground/api";
import { PlayerSlot } from "ttpg-darrell";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { AbstractStrategyCardBody } from "../abstract-strategy-card-body/abstract-strategy-card-body";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
/**
 * 2x wide, with an abstract body below the title.
 * [Play|Follow] [Pass]
 */
export declare class StrategyCardUI extends AbstractUI {
    private readonly _strategyCardsState;
    private readonly _strategyCardBody;
    private readonly _playerSlot;
    private readonly _isPlay;
    private readonly _name;
    private readonly _ui;
    private readonly _buttonPlayingPlayerFinished;
    private readonly _buttonFollow;
    private readonly _buttonPass;
    private readonly _onPlayOrFollow;
    private readonly _onPass;
    constructor(scale: number, strategyCardsState: StrategyCardsState, strategyCardBody: AbstractStrategyCardBody, playerSlot: PlayerSlot);
    destroy(): void;
    getButtonPlayingPlayerFinished(): Button;
    getButtonFollow(): Button;
    getButtonPass(): Button;
}

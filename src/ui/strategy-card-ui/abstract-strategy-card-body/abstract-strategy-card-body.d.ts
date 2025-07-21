import { PlayerSlot } from "ttpg-darrell";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
/**
 * Manage the contents of a strategy card UI (betweent the title and the
 * play/pass buttons).
 *
 * Body can be empty.  Also provides optional additional report text.
 *
 * Use getState/setState to preserve any data needed to regenerate the body.
 */
export declare abstract class AbstractStrategyCardBody {
    private readonly _strategyCardsState;
    private readonly _strategyCardNumber;
    private readonly _playerSlot;
    constructor(strategyCardsState: StrategyCardsState, strategyCardNumber: number, playerSlot: PlayerSlot);
    getState(): string | undefined;
    setState(state: string): void;
    isPlayingPlayer(): boolean;
    getPlayerSlot(): PlayerSlot;
    getStrategyCardNumber(): number;
    abstract getStrategyCardName(): string;
    abstract getBody(scale: number): AbstractUI | undefined;
    abstract getReport(): string | undefined;
}

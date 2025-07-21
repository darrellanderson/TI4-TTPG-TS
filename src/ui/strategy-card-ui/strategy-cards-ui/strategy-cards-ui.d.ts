import { PlayerSlot } from "ttpg-darrell";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
/**
 * UI with all active strategy cards.
 */
export declare class StrategyCardsUI extends AbstractUI {
    private readonly _ui;
    constructor(scale: number, strategyCardsState: StrategyCardsState, playerSlot: PlayerSlot);
    destroy(): void;
}

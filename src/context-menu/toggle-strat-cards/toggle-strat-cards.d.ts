import { IGlobal, PlayerSlot, Window } from "ttpg-darrell";
import { StrategyCardsState } from "../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
/**
 *  Manage window with active strategy cards.
 */
export declare class ToggleStratCards implements IGlobal {
    static readonly TOGGLE_ACTION_NAME: string;
    private readonly _strategyCardsState;
    private readonly _playerSlotToWindowData;
    /**
     * Cannot use the normal "toggle window" handler because there's a
     * different window for each player.
     */
    private readonly _onCustomActionHandler;
    private readonly _onStrategyCardsStateChangedHandler;
    _closeWindow(playerSlot: number): void;
    _openWindow(playerSlot: number): void;
    _updateWindow(playerSlot: number): void;
    constructor();
    init(): void;
    getStrategyCardsState(): StrategyCardsState;
    _createWindow(playerSlot: PlayerSlot): Window;
}

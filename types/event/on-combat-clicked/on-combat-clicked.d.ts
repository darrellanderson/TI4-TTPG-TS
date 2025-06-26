import { IGlobal } from "ttpg-darrell";
/**
 * Listen for combat UI clicks, turn into combat rolls.
 */
export declare class OnCombatClicked implements IGlobal {
    private readonly _onCombatClickedHandler;
    init(): void;
    destroy(): void;
}

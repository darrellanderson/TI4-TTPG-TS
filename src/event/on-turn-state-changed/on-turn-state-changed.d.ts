import { IGlobal } from "ttpg-darrell";
/**
 * Clear passed state when all players have passed.
 */
export declare class OnTurnStateChanged implements IGlobal {
    private readonly _onTurnStateChanged;
    init(): void;
    destroy(): void;
}

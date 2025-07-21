import { IGlobal } from "ttpg-darrell";
/**
 * Trigger the game end event when a player reaches the required score.
 * Only send it once.
 */
export declare class OnGameEnd implements IGlobal {
    private readonly _onGameData;
    init(): void;
}

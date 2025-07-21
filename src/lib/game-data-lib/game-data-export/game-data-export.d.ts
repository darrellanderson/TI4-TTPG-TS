import { IGlobal } from "ttpg-darrell";
import { GameData } from "../game-data/game-data";
/**
 * Send game data to AppEngine for stats.
 */
export declare class GameDataExport implements IGlobal {
    private readonly _onGameData;
    private readonly _onGameEnd;
    private readonly _onInterval;
    private _sendNextGameData;
    private _intervalHandle;
    init(): void;
    destroy(): void;
    _maybeStartInterval(executionReason: string): void;
    _send(gameData: GameData): void;
}

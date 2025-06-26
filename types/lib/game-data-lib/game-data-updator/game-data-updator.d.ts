import { GameData } from "../game-data/game-data";
import { IGameDataUpdator } from "../i-game-data-updator/i-game-data-updator";
export declare class GameDataUpdator {
    private readonly _updators;
    private _gameData;
    private _nextProcessIndex;
    private _intervalHandle;
    readonly _onInterval: () => void;
    static createGameData(): GameData;
    constructor(updators: Array<IGameDataUpdator>);
    /**
     * Processes the next updator in the list.
     *
     * @returns true if all updators have been processed this cycle
     */
    _processNext(): boolean;
    startPeriodicUpdates(): this;
    stopPeriodicUpdates(): this;
    startPeriodicUpdatesInProduction(): this;
}

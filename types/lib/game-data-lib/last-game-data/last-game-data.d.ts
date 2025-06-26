import { IGlobal } from "ttpg-darrell";
import { GameData } from "../game-data/game-data";
export declare class LastGameData implements IGlobal {
    private _gameData;
    private readonly _onGameData;
    init(): void;
    destroy(): void;
    getLastGameData(): GameData | undefined;
}

import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
export declare class UpdatorMapString implements IGameDataUpdator {
    private readonly _mapStringSave;
    update(gameData: GameData): void;
}

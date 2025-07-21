import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
export declare class UpdatorPlayerStrategyCards implements IGameDataUpdator {
    private readonly _find;
    update(gameData: GameData): void;
}

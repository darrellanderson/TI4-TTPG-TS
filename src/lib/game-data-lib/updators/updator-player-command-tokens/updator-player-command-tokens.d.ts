import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
export declare class UpdatorPlayerCommandTokens implements IGameDataUpdator {
    private readonly _commandTokenCounter;
    update(gameData: GameData): void;
}

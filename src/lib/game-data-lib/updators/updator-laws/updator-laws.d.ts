import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
export declare class UpdatorLaws implements IGameDataUpdator {
    private readonly _cardUtil;
    update(gameData: GameData): void;
}

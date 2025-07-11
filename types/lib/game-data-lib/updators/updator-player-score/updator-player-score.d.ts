import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
export declare class UpdatorPlayerScore implements IGameDataUpdator {
    private readonly _scoreboard;
    update(gameData: GameData): void;
}

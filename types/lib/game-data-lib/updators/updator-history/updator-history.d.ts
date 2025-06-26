import { IGlobal } from "ttpg-darrell";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
/**
 * Report a very minimal history of GameData per round.
 */
export declare class UpdatorHistory implements IGameDataUpdator, IGlobal {
    private readonly _find;
    private _registered;
    private readonly _onGameData;
    init(): void;
    update(gameData: GameData): void;
}

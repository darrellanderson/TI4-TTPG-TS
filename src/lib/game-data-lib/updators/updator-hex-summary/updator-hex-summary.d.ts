import { HexType } from "ttpg-darrell";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { EntityType } from "./hex-summary-codes";
export declare class UpdatorHexSummary implements IGameDataUpdator {
    update(gameData: GameData): void;
    _getAllEntityTypes(): Array<EntityType>;
    _mergeEntityTypes(entityTypes: Array<EntityType>): Array<EntityType>;
    /**
     * Seconds: hex position.
     * @param hex
     * @returns
     */
    _encodeHex(hex: HexType): string;
    /**
     * Third: what is in the system.
     * @param entityTypes
     * @returns
     */
    _encodeEntityTypes(entityTypes: Array<EntityType>): string;
    encodeAll(): string;
}

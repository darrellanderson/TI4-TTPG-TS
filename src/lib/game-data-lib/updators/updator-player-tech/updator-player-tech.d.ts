import { Card } from "@tabletop-playground/api";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
export declare class UpdatorPlayerTech implements IGameDataUpdator {
    private readonly _cardUtil;
    private readonly _find;
    static getTimestamp(card: Card): number;
    static setTimestamp(card: Card): void;
    constructor();
    update(gameData: GameData): void;
}

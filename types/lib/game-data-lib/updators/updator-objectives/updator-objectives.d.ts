import { Card, GameObject } from "@tabletop-playground/api";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { UpdatorObjectivesType } from "./updator-objectives-type";
export declare class UpdatorObjectives implements IGameDataUpdator {
    update(gameData: GameData): void;
    _getControlTokens(): Array<GameObject>;
    _getRelevantCards(): Array<Card>;
    _fillObjectivesType(objectiveCards: Array<Card>): UpdatorObjectivesType;
}

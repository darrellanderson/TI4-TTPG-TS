import { GameData } from "../game-data/game-data";

export interface IGameDataUpdator {
  update(gameData: GameData): void;
}

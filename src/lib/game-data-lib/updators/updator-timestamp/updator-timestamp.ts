import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";

export class UpdatorTimestamp implements IGameDataUpdator {
  update(gameData: GameData): void {
    gameData.timestamp = Math.ceil(Date.now() / 1000);
  }
}

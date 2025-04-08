import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";

export class UpdatorSetupTimestamp implements IGameDataUpdator {
  update(gameData: GameData): void {
    gameData.setupTimestamp = TI4.config.timestamp;
  }
}

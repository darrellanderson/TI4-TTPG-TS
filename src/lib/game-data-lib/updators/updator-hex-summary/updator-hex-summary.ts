import { GameData } from "lib/game-data-lib/game-data/game-data";
import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";

export class UpdatorHexSummary implements IGameDataUpdator {
  update(gameData: GameData): void {
    gameData.hexSummary = "foo";
  }
}

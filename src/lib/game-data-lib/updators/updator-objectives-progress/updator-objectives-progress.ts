import { GameData } from "lib/game-data-lib/game-data/game-data";
import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";

export class UpdatorObjectivesProgress implements IGameDataUpdator {
  update(_gameData: GameData): void {
    throw new Error("Method not implemented.");
  }
}

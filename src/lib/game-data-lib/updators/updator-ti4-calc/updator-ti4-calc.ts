import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";

export class UpdatorTI4Calc implements IGameDataUpdator {
  // Cache old result in order to fill when gameData gets reset.
  // (Replace wtih better data when we have it.)

  update(gameData: GameData): void {}
}

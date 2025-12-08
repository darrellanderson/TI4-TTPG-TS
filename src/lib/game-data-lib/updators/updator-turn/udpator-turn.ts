import { PlayerSlot } from "ttpg-darrell";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";

export class UpdatorTurn implements IGameDataUpdator {
  update(gameData: GameData): void {
    const current: PlayerSlot = TI4.turnOrder.getCurrentTurn();
    const colorName: string | undefined =
      TI4.playerColor.getSlotColorName(current);
    if (colorName) {
      gameData.turn = colorName;
    } else {
      gameData.turn = "-";
    }
  }
}

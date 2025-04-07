import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";

export class UpdatorPlayerColor implements IGameDataUpdator {
  update(gameData: GameData): void {
    gameData.players.forEach(
      (playerData: PerPlayerGameData, seatIndex: number): void => {
        const playerSlot: number =
          TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
        const colorName: string =
          TI4.playerColor.getSlotColorNameOrThrow(playerSlot);
        playerData.color = colorName;
      }
    );
  }
}

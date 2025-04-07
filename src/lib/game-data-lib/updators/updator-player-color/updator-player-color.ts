import { PlayerSeatType } from "lib/player-lib/player-seats/player-seats";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";

export class UpdatorPlayerColor implements IGameDataUpdator {
  update(gameData: GameData): void {
    TI4.playerSeats
      .getAllSeats()
      .forEach((seat: PlayerSeatType, seatIndex: number): void => {
        const playerData: PerPlayerGameData = GameDataUpdator.getPlayerData(
          gameData,
          seatIndex
        );
        const playerSlot: number = seat.playerSlot;
        const colorName: string =
          TI4.playerColor.getSlotColorNameOrThrow(playerSlot);
        playerData.color = colorName;
      });
  }
}

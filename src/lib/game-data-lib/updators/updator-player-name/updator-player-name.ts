import { PlayerSeatType } from "../../../player-lib/player-seats/player-seats";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { Player, world } from "@tabletop-playground/api";

export class UpdatorPlayerName implements IGameDataUpdator {
  update(gameData: GameData): void {
    TI4.playerSeats
      .getAllSeats()
      .forEach((seat: PlayerSeatType, seatIndex: number): void => {
        const playerData: PerPlayerGameData = GameDataUpdator.getPlayerData(
          gameData,
          seatIndex
        );
        const player: Player | undefined = world.getPlayerBySlot(
          seat.playerSlot
        );
        playerData.name = player ? player.getName() : "";
      });
  }
}

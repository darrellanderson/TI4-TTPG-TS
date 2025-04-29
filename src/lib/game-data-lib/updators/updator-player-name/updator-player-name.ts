import { Player, world } from "@tabletop-playground/api";
import { PlayerSlot } from "ttpg-darrell";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";

export class UpdatorPlayerName implements IGameDataUpdator {
  update(gameData: GameData): void {
    gameData.players.forEach(
      (playerData: PerPlayerGameData, seatIndex: number): void => {
        const playerSlot: PlayerSlot | undefined =
          TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
        const player: Player | undefined = world.getPlayerBySlot(playerSlot);
        playerData.steamName = player ? player.getName() : "";
      }
    );
  }
}

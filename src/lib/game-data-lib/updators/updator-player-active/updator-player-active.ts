import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";

export class UpdatorPlayerActive implements IGameDataUpdator {
  update(gameData: GameData): void {
    gameData.players.forEach((player: PerPlayerGameData, seatIndex: number) => {
      const playerSlot: number =
        TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
      player.active = !TI4.turnOrder.getPassed(playerSlot);
    });
  }
}

import { PlayerSlot } from "ttpg-darrell";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";

export class UpdatorPlayerTurnOrder implements IGameDataUpdator {
  update(gameData: GameData): void {
    const turnOrder: Array<PlayerSlot> = TI4.turnOrder.getTurnOrder();
    gameData.players.forEach((player: PerPlayerGameData, seatIndex: number) => {
      const playerSlot: PlayerSlot =
        TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
      const turnOrderIndex: number = turnOrder.indexOf(playerSlot);
      if (turnOrderIndex >= 0) {
        player.turnOrder = turnOrderIndex;
      }
    });
  }
}

import { PlayerSlot } from "ttpg-darrell";
import {
  CommandTokenCounter,
  CommandTokenCounts,
} from "../../../command-token-lib/command-token-counter/command-token-counter";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";

export class UpdatorPlayerCommandTokens implements IGameDataUpdator {
  private readonly _commandTokenCounter: CommandTokenCounter =
    new CommandTokenCounter();

  update(gameData: GameData): void {
    const playerSlotToCommandTokenCounts: Map<PlayerSlot, CommandTokenCounts> =
      this._commandTokenCounter.getPlayerSlotToCommandTokenCounts();
    gameData.players.forEach(
      (player: PerPlayerGameData, seatIndex: number): void => {
        const playerSlot: PlayerSlot =
          TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
        const commandTokenCounts: CommandTokenCounts | undefined =
          playerSlotToCommandTokenCounts.get(playerSlot);
        if (commandTokenCounts) {
          player.commandTokens = {
            tactics: commandTokenCounts.tactic.length,
            fleet: commandTokenCounts.fleet.length,
            strategy: commandTokenCounts.strategy.length,
          };
        } else {
          player.commandTokens = {
            tactics: 0,
            fleet: 0,
            strategy: 0,
          };
        }
      }
    );
  }
}

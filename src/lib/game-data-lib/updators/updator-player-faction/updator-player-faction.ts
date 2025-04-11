import { Faction } from "lib/faction-lib/faction/faction";
import {
  GameData,
  PerPlayerGameData,
} from "lib/game-data-lib/game-data/game-data";
import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
import { PlayerSlot } from "ttpg-darrell";

export class UpdatorPlayerFaction implements IGameDataUpdator {
  update(gameData: GameData): void {
    // Set factionFull and factionShort for each player
    gameData.players.forEach(
      (player: PerPlayerGameData, seatIndex: number): void => {
        const playerSlot: PlayerSlot =
          TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
        const faction: Faction | undefined =
          TI4.factionRegistry.getByPlayerSlot(playerSlot);
        if (faction) {
          player.factionFull = faction.getName();
          player.factionShort = faction.getAbbr().replace("'", "");
        } else {
          player.factionFull = "";
          player.factionShort = "";
        }
      }
    );
  }
}

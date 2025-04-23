import { PlayerSlot } from "ttpg-darrell";
import { Faction } from "../../../faction-lib/faction/faction";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";

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

import { PlayerSlot } from "ttpg-darrell";
import { Scoreboard } from "../../../score-lib/scoreboard/scoreboard";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";

export class UpdatorPlayerScore implements IGameDataUpdator {
  private readonly _scoreboard: Scoreboard = new Scoreboard();

  update(gameData: GameData): void {
    const playerSlotToScore: Map<PlayerSlot, number> =
      this._scoreboard.getPlayerSlotToScore();
    gameData.players.forEach(
      (playerData: PerPlayerGameData, seatIndex: number) => {
        const playerSlot: PlayerSlot | undefined =
          TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
        const score: number | undefined = playerSlotToScore.get(playerSlot);
        playerData.score = score ?? 0;
      }
    );
  }
}

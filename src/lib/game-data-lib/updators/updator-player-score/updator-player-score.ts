import { PlayerSlot } from "ttpg-darrell";
import { Scoreboard } from "../../../score-lib/scoreboard/scoreboard";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";

export class UpdatorPlayerScore implements IGameDataUpdator {
  private readonly _scoreboard: Scoreboard = new Scoreboard();

  update(gameData: GameData): void {
    const playerSlotToScore: Map<PlayerSlot, number> =
      this._scoreboard.getPlayerSlotToScore();
    for (const [playerSlot, score] of playerSlotToScore.entries()) {
      const playerIndex: number =
        TI4.playerSeats.getSeatIndexByPlayerSlotOrThrow(playerSlot);
      const playerData: PerPlayerGameData = GameDataUpdator.getPlayerData(
        gameData,
        playerIndex
      );
      playerData.score = score;
    }
  }
}

import { IGlobal } from "ttpg-darrell";
import {
  GameData,
  PerPlayerGameData,
} from "../../lib/game-data-lib/game-data/game-data";

/**
 * Trigger the game end event when a player reaches the required score.
 * Only send it once.
 */
export class OnGameEnd implements IGlobal {
  private readonly _onGameData = (gameData: GameData): void => {
    const scoreNeeded: number = TI4.config.gamePoints;
    gameData.players.forEach((player: PerPlayerGameData) => {
      if (player.score && player.score >= scoreNeeded) {
        TI4.events.onGameData.remove(this._onGameData);
        TI4.events.onGameEnd.trigger();
        return;
      }
    });
  };

  init(): void {
    TI4.events.onGameData.add(this._onGameData);
  }
}

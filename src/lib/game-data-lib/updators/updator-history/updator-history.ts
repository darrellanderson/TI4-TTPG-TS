import { GameObject } from "@tabletop-playground/api";
import { Find, IGlobal } from "ttpg-darrell";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";

/**
 * Report a very minimal history of GameData per round.
 */
export class UpdatorHistory implements IGameDataUpdator, IGlobal {
  private readonly _find: Find = new Find();
  private _registered: boolean = false;

  private readonly _onGameData = (gameData: GameData): void => {
    // Extract fields for history:
    // - color and score for the "tempo" streamer frame.
    const minimalGameData: GameData = {
      players: gameData.players.map(
        (player: PerPlayerGameData): PerPlayerGameData => {
          return {
            color: player.color,
            score: player.score,
          };
        }
      ),
    };
    const minimalJson: string = JSON.stringify(minimalGameData);

    // Because this may grow over time, store it on a game object and not world.
    // Use the scoreboard.
    const nsid: string = "token:base/scoreboard";
    const owningPlayerSlot: number | undefined = undefined;
    const skipContained: boolean = true;
    const scoreboard: GameObject | undefined = this._find.findGameObject(
      nsid,
      owningPlayerSlot,
      skipContained
    );

    // Update per-round history (each entry is limited to 1KB).
    const round: number | undefined = gameData.round;
    if (round && scoreboard) {
      const key = `history-${round}`;
      scoreboard.setSavedData(minimalJson, key);
    }
  };

  init(): void {
    TI4.events.onGameData.add(this._onGameData);
  }

  update(gameData: GameData): void {
    const history: Array<GameData> = [];

    // Look for per-round history stored on the scoreboard.
    const nsid: string = "token:base/scoreboard";
    const owningPlayerSlot: number | undefined = undefined;
    const skipContained: boolean = true;
    const scoreboard: GameObject | undefined = this._find.findGameObject(
      nsid,
      owningPlayerSlot,
      skipContained
    );

    if (scoreboard) {
      for (let round = 1; round <= 10; round++) {
        const key = `history-${round}`;
        const json: string | undefined = scoreboard.getSavedData(key);
        if (json && json.length > 0) {
          const roundGameData: GameData = JSON.parse(json);
          history[round - 1] = roundGameData;
        }
      }
    }

    gameData.history = history;
  }
}

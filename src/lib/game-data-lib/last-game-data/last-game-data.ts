import { IGlobal } from "ttpg-darrell";
import { GameData } from "../game-data/game-data";

export class LastGameData implements IGlobal {
  private _gameData: GameData | undefined = undefined;

  private readonly _onGameData: (gameData: GameData) => void = (
    gameData: GameData
  ): void => {
    this._gameData = gameData;
  };

  init(): void {
    TI4.events.onGameData.add(this._onGameData);
  }

  destroy(): void {
    TI4.events.onGameData.remove(this._onGameData);
  }

  getLastGameData(): GameData | undefined {
    return this._gameData;
  }
}

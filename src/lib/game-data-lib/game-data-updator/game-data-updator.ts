import { GameWorld } from "@tabletop-playground/api";
import { ErrorHandler } from "ttpg-darrell";
import { GameData } from "../game-data/game-data";
import { IGameDataUpdator } from "../i-game-data-updator/i-game-data-updator";

const DELAY_BETWEEN_UPDATE_CYCLES_MSECS = 3000;

export class GameDataUpdator {
  private readonly _updators: Array<IGameDataUpdator>;

  private _gameData: GameData | undefined = undefined;
  private _nextProcessIndex: number = 0;
  private _intervalHandle: NodeJS.Timer | undefined = undefined;

  readonly _onInterval = (): void => {
    this._processNext();
  };

  static createGameData(): GameData {
    const gameData: GameData = {
      players: [],
    };
    for (let i = 0; i < TI4.config.playerCount; i++) {
      gameData.players.push({});
    }
    gameData.platform = "ttpg";
    return gameData;
  }

  constructor(updators: Array<IGameDataUpdator>) {
    this._updators = updators;
  }

  /**
   * Processes the next updator in the list.
   *
   * @returns true if all updators have been processed this cycle
   */
  _processNext(): boolean {
    if (!this._gameData) {
      this._gameData = GameDataUpdator.createGameData();
    }

    const updator: IGameDataUpdator | undefined =
      this._updators[this._nextProcessIndex];
    this._nextProcessIndex =
      (this._nextProcessIndex + 1) % this._updators.length;
    if (updator && this._gameData) {
      try {
        updator.update(this._gameData);
      } catch (error) {
        const stack: string | undefined = new Error(error).stack;
        if (stack) {
          ErrorHandler.onError.trigger(stack);
        }
      }
    }
    const finishedCycle: boolean = this._nextProcessIndex === 0;
    if (finishedCycle && this._gameData) {
      TI4.events.onGameData.trigger(this._gameData);
      this._gameData = undefined;
    }
    return finishedCycle;
  }

  startPeriodicUpdates(): this {
    if (this._intervalHandle) {
      clearInterval(this._intervalHandle);
      this._intervalHandle = undefined;
    }
    const intervalMsecs: number = Math.ceil(
      DELAY_BETWEEN_UPDATE_CYCLES_MSECS / (this._updators.length + 1) // in case zero
    );
    this._intervalHandle = setInterval(this._onInterval, intervalMsecs);
    return this;
  }

  stopPeriodicUpdates(): this {
    if (this._intervalHandle) {
      clearInterval(this._intervalHandle);
      this._intervalHandle = undefined;
    }
    return this;
  }

  startPeriodicUpdatesInProduction(): this {
    this.startPeriodicUpdates();
    if (GameWorld.getExecutionReason() === "unittest") {
      this.stopPeriodicUpdates();
    }
    return this;
  }
}

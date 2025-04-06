import { globalEvents } from "@tabletop-playground/api";
import { GameData, PerPlayerGameData } from "../game-data/game-data";
import { IGameDataUpdator } from "../i-game-data-updator/i-game-data-updator";

const DELAY_BETWEEN_UPDATE_CYCLES_MSECS = 3000;

export class GameDataUpdator {
  private readonly _updators: Array<IGameDataUpdator>;

  private _gameData: GameData = GameDataUpdator.createGameData();
  private _nextProcessIndex: number = 0;
  private _intervalHandle: NodeJS.Timer | undefined = undefined;
  private _cycleStartTimestamp: number = 0;

  readonly _onPeriodicUpdateStart = (): void => {
    this._cycleStartTimestamp = Date.now();
    globalEvents.onTick.remove(this._onPeriodicUpdateStart);
    globalEvents.onTick.add(this._onTickHandler);
  };

  readonly _onTickHandler = (): void => {
    const finishedCycle: boolean = this._processNext();
    if (finishedCycle) {
      globalEvents.onTick.remove(this._onTickHandler);
      TI4.events.onGameData.trigger(this._gameData);
    }
    const now: number = Date.now();
    const elapsedTime: number = now - this._cycleStartTimestamp;
    const delay: number = Math.max(
      DELAY_BETWEEN_UPDATE_CYCLES_MSECS - elapsedTime,
      100
    );
    this._intervalHandle = setTimeout(this._onPeriodicUpdateStart, delay);
  };

  static createGameData(): GameData {
    const gameData: GameData = {
      players: [],
    };
    for (let i = 0; i < TI4.config.playerCount; i++) {
      gameData.players.push({});
    }
    return gameData;
  }

  static getPlayerData(
    gameData: GameData,
    playerIndex: number
  ): PerPlayerGameData | undefined {
    const playerData: PerPlayerGameData | undefined =
      gameData.players[playerIndex];
    if (!playerData) {
      throw new Error(`Player data not found for index ${playerIndex}`);
    }
    return playerData;
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
    const updator: IGameDataUpdator | undefined =
      this._updators[this._nextProcessIndex];
    this._nextProcessIndex =
      (this._nextProcessIndex + 1) % this._updators.length;
    if (updator) {
      updator.update(this._gameData);
    }
    return this._nextProcessIndex === 0;
  }

  startPeriodicUpdates(): void {
    if (this._intervalHandle) {
      clearInterval(this._intervalHandle);
      this._intervalHandle = undefined;
    }
    this._intervalHandle = setInterval(this._onPeriodicUpdateStart, 3000);
  }

  stopPeriodicUpdates(): void {
    if (this._intervalHandle) {
      clearInterval(this._intervalHandle);
      this._intervalHandle = undefined;
    }
  }
}

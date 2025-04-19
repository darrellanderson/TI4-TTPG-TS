import { world } from "@tabletop-playground/api";
import { GameData } from "lib/game-data-lib/game-data/game-data";
import { IGlobal, NamespaceId } from "ttpg-darrell";

export class PlayerActionPhaseTime implements IGlobal {
  private readonly _namespaceId: NamespaceId | undefined;
  private readonly _roundToSeatIndexToSeconds: Array<Array<number>>;

  private _intervalHandle: NodeJS.Timer | undefined = undefined;
  private _isActionPhase: boolean = false;
  private _round: number = 0;

  constructor(namespaceId: NamespaceId | undefined) {
    this._namespaceId = namespaceId;
    this._roundToSeatIndexToSeconds = this._load();
  }

  _save(): void {
    if (this._namespaceId) {
      const json: string = JSON.stringify(this._roundToSeatIndexToSeconds);
      world.setSavedData(json, this._namespaceId);
    }
  }

  _load(): Array<Array<number>> {
    let result: Array<Array<number>> = [];
    if (this._namespaceId) {
      const json: string | undefined = world.getSavedData(this._namespaceId);
      if (json && json.length > 0) {
        result = JSON.parse(json) as Array<Array<number>>;
      }
    }
    return result;
  }

  private readonly _onGameData = (gameData: GameData): void => {
    // If all players have srategy cards then we are in the action phase.
    let pickedStrategyCardsCount: number = 0;
    for (const player of gameData.players) {
      if (player.strategyCards) {
        pickedStrategyCardsCount += player.strategyCards.length;
      }
    }

    const required: number =
      TI4.config.playerCount < 5
        ? TI4.config.playerCount * 2
        : TI4.config.playerCount;
    this._isActionPhase = pickedStrategyCardsCount >= required;
    this._round = gameData.round ?? 0;
  };

  private readonly _onInterval = (): void => {
    if (this.isActiveActionPhase()) {
      const activePlayerSlot = TI4.turnOrder.getCurrentTurn();
      const seatIndex: number =
        TI4.playerSeats.getSeatIndexByPlayerSlot(activePlayerSlot);
      if (seatIndex >= 0) {
        this._incrSeconds(this._round, seatIndex, 1);
      }
    }
  };

  _getSeatIndexToSeconds(round: number): Array<number> {
    let seatIndexToSeconds: Array<number> | undefined =
      this._roundToSeatIndexToSeconds[round];
    if (seatIndexToSeconds === undefined) {
      seatIndexToSeconds = [];
      this._roundToSeatIndexToSeconds[round] = seatIndexToSeconds;
    }
    return seatIndexToSeconds;
  }

  _incrSeconds(round: number, seatIndex: number, incrBy: number): void {
    const seatIndexToSeconds: Array<number> =
      this._getSeatIndexToSeconds(round);
    const seconds: number = this.getSeconds(round, seatIndex) + incrBy;
    seatIndexToSeconds[seatIndex] = seconds;

    this._save();
  }

  getSeconds(round: number, seatIndex: number): number {
    const seatIndexToSeconds: Array<number> =
      this._getSeatIndexToSeconds(round);
    const seconds: number | undefined = seatIndexToSeconds[seatIndex];
    return seconds ?? 0;
  }

  init(): void {
    TI4.events.onGameData.add(this._onGameData);
    this._intervalHandle = setInterval(this._onInterval, 1000);
  }

  destroy(): void {
    if (this._intervalHandle) {
      clearInterval(this._intervalHandle);
    }
    TI4.events.onGameData.remove(this._onGameData);
  }

  getRound(): number {
    return this._round;
  }

  isActiveActionPhase(): boolean {
    const isTimerActive: boolean = TI4.timer.export().active;
    return this._isActionPhase && isTimerActive;
  }
}

import {
  AbstractRootGameData,
  AbstractPerPlayerGameData,
} from "../abstract-game-data/abstract-game-data";

export class GameData {
  private readonly _gameDatas: Array<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AbstractRootGameData<any> | AbstractPerPlayerGameData<any>
  > = [];

  private _nextProcessIndex: number = 0;
  private readonly _gameData = { players: [] }; // assembled game data

  add(
    abstractGameDatas: Array<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AbstractRootGameData<any> | AbstractPerPlayerGameData<any>
    >
  ): void {
    this._gameDatas.push(...abstractGameDatas);
  }

  getGameData(): object {
    return this._gameData;
  }

  processOne(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entry: AbstractRootGameData<any> | AbstractPerPlayerGameData<any>
  ) {
    if (entry instanceof AbstractRootGameData) {
      const fieldName: string = entry.getFieldName();
      const rootData = entry.getRootData();
      if (rootData !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this._gameData as any)[fieldName] = rootData;
      }
    } else if (entry instanceof AbstractPerPlayerGameData) {
      const fieldName: string = entry.getFieldName();
      const playerSlotToData = entry.getPlayerData();
      if (playerSlotToData !== undefined) {
        for (const [playerSlot, data] of playerSlotToData.entries()) {
          const seatIndex: number | undefined =
            TI4.playerSeats.getSeatIndexByPlayerSlot(playerSlot);
          if (seatIndex !== undefined) {
            let playerData: object | undefined =
              this._gameData.players[seatIndex];
            if (!playerData) {
              playerData = {};
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (this._gameData.players as any)[seatIndex] = playerData;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (playerData as any)[fieldName] = data;
          }
        }
      }
    }
  }

  processNext(): boolean {
    const entry: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | AbstractRootGameData<any>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | AbstractPerPlayerGameData<any>
      | undefined = this._gameDatas[this._nextProcessIndex];
    if (entry) {
      this.processOne(entry);
    }
    this._nextProcessIndex =
      (this._nextProcessIndex + 1) % this._gameDatas.length;
    return this._nextProcessIndex === 0; // finished last
  }

  processAll(): void {
    for (const entry of this._gameDatas) {
      this.processOne(entry);
    }
  }
}

import { AbstractGameData } from "../abstract-game-data/abstract-game-data";

export class GameData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly gameDatas: Array<AbstractGameData<any>> = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  add(abstractGameDatas: Array<AbstractGameData<any>>): void {
    //
  }
}

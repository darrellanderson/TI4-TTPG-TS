import { GameDataUpdator } from "../game-data-updator/game-data-updator";
import { GameData } from "../game-data/game-data";
import { IGameDataUpdator } from "./i-game-data-updator";

class MyUpdator implements IGameDataUpdator {
  update(_gameData: GameData): void {}
}

it("update", () => {
  const gameData: GameData = GameDataUpdator.createGameData();
  const updator: IGameDataUpdator = new MyUpdator();
  updator.update(gameData);
});

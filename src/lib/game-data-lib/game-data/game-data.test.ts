import { AbstractGameData } from "../abstract-game-data/abstract-game-data";
import { GameData } from "./game-data";

class MyGameData extends AbstractGameData<number> {
  getFieldName(): string {
    return "myField";
  }
}

it("add", () => {
  const gameData = new GameData();
  gameData.add([new MyGameData()]);
});

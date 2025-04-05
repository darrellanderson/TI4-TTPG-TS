import { MockCardHolder } from "ttpg-mock";
import {
  AbstractPerPlayerGameData,
  AbstractRootGameData,
} from "../abstract-game-data/abstract-game-data";
import { GameData } from "./game-data";

class MyRootGameData extends AbstractRootGameData<number> {
  getFieldName(): string {
    return "myRootField";
  }
  getRootData(): number | undefined {
    return 42;
  }
}

class MyPerPlayerGameData extends AbstractPerPlayerGameData<number> {
  getFieldName(): string {
    return "myPerPlayerField";
  }
  getPlayerData(): Map<number, number> | undefined {
    const playerData = new Map<number, number>();
    playerData.set(10, 42);
    return playerData;
  }
}

it("root and per-player", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const gameData = new GameData();
  gameData.add([new MyRootGameData(), new MyPerPlayerGameData()]);

  gameData.processAll();

  const data = gameData.getGameData();
  expect(data).toEqual({
    myRootField: 42,
    players: [{ myPerPlayerField: 42 }],
  });
});

it("processNext", () => {
  const gameData = new GameData();
  gameData.add([new MyRootGameData()]);
  const wasLast: boolean = gameData.processNext();
  expect(wasLast).toBe(true);
});

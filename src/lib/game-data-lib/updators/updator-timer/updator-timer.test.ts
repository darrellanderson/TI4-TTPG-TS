import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorTimer } from "./updator-timer";
import { GameData } from "../../game-data/game-data";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorTimer;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorTimer().update(gameData);
  if (gameData.timer) {
    gameData.timer.seconds = 0;
  }
  expect(gameData.timer).toEqual({
    anchorSeconds: 0,
    anchorTimestamp: 0,
    countDown: 0,
    direction: 1,
    seconds: 0,
  });
});

it("data (countdown)", () => {
  TI4.timer.start(100, -1);

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorTimer().update(gameData);
  if (gameData.timer) {
    gameData.timer.seconds = 0;
  }
  expect(gameData.timer).toEqual({
    anchorSeconds: 100,
    anchorTimestamp: gameData.timer?.anchorTimestamp,
    countDown: 100,
    direction: -1,
    seconds: 0,
  });

  TI4.timer.stop();
});

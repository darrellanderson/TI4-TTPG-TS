import { GameDataUpdator } from "../game-data-updator/game-data-updator";
import { GameData } from "../game-data/game-data";
import { LastGameData } from "./last-game-data";

it("init/destroy", () => {
  const lastGameData = new LastGameData();
  lastGameData.init();
  lastGameData.destroy();
});

it("get, event", () => {
  const lastGameData = new LastGameData();
  lastGameData.init();

  let lastGameDataValue: GameData | undefined = undefined;
  lastGameDataValue = lastGameData.getLastGameData();
  expect(lastGameDataValue).toBeUndefined();

  const gameData: GameData = GameDataUpdator.createGameData();
  TI4.events.onGameData.trigger(gameData);

  lastGameDataValue = lastGameData.getLastGameData();
  expect(lastGameDataValue).toBe(gameData);

  lastGameData.destroy();
});

import { GameDataUpdator } from "../game-data-updator/game-data-updator";
import { GameData } from "../game-data/game-data";
import { GameDataExport } from "./game-data-export";

it("constructor/init/destroy", () => {
  const gameDataExport = new GameDataExport();
  gameDataExport.init();
  gameDataExport.destroy();
});

it("onGameEnd/onGameData", () => {
  // fetch(url: string, options?: FetchOptions): Promise<FetchResponse>
  jest.spyOn(global, "fetch").mockImplementation();

  const gameDataExport = new GameDataExport();
  gameDataExport.init();

  TI4.events.onGameEnd.trigger();
  const gameData: GameData = GameDataUpdator.createGameData();
  TI4.events.onGameData.trigger(gameData);

  gameDataExport.destroy();
});

it("interval", () => {
  jest.useFakeTimers();

  const gameDataExport = new GameDataExport();
  gameDataExport.init();
  gameDataExport._maybeStartInterval("real");

  jest.runOnlyPendingTimers();

  gameDataExport.destroy();
});

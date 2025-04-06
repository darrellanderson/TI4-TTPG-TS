import { GameData } from "../../game-data-lib/game-data/game-data";
import { GameDataUpdator } from "../../game-data-lib/game-data-updator/game-data-updator";
import { UseStreamerBuddy } from "./use-streamer-buddy";

it("constructor/init", () => {
  const useStreamerBuddy = new UseStreamerBuddy("@test/test");
  useStreamerBuddy.init();
});

it("set/get", () => {
  const useStreamerBuddy = new UseStreamerBuddy("@test/test");
  useStreamerBuddy.init();

  expect(useStreamerBuddy.getUseStreamerBuddy()).toBe(false);
  useStreamerBuddy.setUseStreamerBuddy(true);
  expect(useStreamerBuddy.getUseStreamerBuddy()).toBe(true);

  const loadFromState = new UseStreamerBuddy("@test/test");
  loadFromState.init();
  expect(loadFromState.getUseStreamerBuddy()).toBe(true);

  loadFromState.setUseStreamerBuddy(false);
  useStreamerBuddy.setUseStreamerBuddy(false);
});

it("_onGameData", () => {
  // fetch(url: string, options?: FetchOptions): Promise<FetchResponse>
  jest.spyOn(global, "fetch").mockImplementation();

  const useStreamerBuddy = new UseStreamerBuddy("@test/test");
  useStreamerBuddy.init();
  useStreamerBuddy.setUseStreamerBuddy(true);

  const gameData: GameData = GameDataUpdator.createGameData();
  useStreamerBuddy._onGameData(gameData);
});

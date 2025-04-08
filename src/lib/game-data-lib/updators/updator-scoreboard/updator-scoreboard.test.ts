import { GameData } from "../../game-data/game-data";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorScoreboard } from "./updator-scoreboard";
import { MockGameObject } from "ttpg-mock";
it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorScoreboard;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data (no scoreboard)", () => {
  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorScoreboard().update(gameData);
  expect(gameData.scoreboard).toEqual(14);
});

it("data (face-up scoreboard)", () => {
  MockGameObject.simple("token:base/scoreboard");
  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorScoreboard().update(gameData);
  expect(gameData.scoreboard).toEqual(10);
});

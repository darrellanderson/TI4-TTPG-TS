import { GameData } from "../../game-data/game-data";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { UpdatorMapString } from "./updator-map-string";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorMapString;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorMapString().update(gameData);
  expect(gameData.mapString).toBeDefined();
});

import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorTimestamp } from "./updator-timestamp";
import { GameData } from "../../game-data/game-data";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorTimestamp;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorTimestamp().update(gameData);
  expect(gameData.timestamp).toBeGreaterThan(0);
});

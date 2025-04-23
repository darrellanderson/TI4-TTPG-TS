import { GameData } from "../../game-data/game-data";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorSetupTimestamp } from "./updator-setup-timestamp";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorSetupTimestamp;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorSetupTimestamp().update(gameData);
  expect(gameData.setupTimestamp).toBeDefined();
});

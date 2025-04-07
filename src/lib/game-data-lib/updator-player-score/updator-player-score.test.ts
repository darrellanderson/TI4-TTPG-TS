import { MockCardHolder, MockGameObject } from "ttpg-mock";
import { GameData } from "../game-data/game-data";
import { GameDataUpdator } from "../game-data-updator/game-data-updator";
import { UpdatorPlayerScore } from "./updator-player-score";
import { GAME_DATA_UPDATORS } from "../game-data-updators/game-data-updators";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerScore;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockGameObject.simple("token:base/scoreboard");
  MockGameObject.simple("token.control:base/sol", {
    owningPlayerSlot: 10,
    position: [0, 0, 0],
  });

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerScore().update(gameData);
  expect(gameData.players[0]?.score).toBe(5);
});

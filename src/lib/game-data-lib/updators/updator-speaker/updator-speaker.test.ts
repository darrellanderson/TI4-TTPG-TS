import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorSpeaker } from "./updator-speaker";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { GameData } from "../../game-data/game-data";
import { MockCardHolder, MockGameObject } from "ttpg-mock";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorSpeaker;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockGameObject.simple("token:base/speaker");

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorSpeaker().update(gameData);
  expect(gameData.speaker).toEqual("green");
});

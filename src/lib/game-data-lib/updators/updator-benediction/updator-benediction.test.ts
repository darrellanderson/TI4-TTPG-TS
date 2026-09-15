import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorBenediction } from "./updator-benediction";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { GameData } from "../../game-data/game-data";
import { MockCardHolder, MockGameObject } from "ttpg-mock";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorBenediction;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockGameObject.simple("token:twilights-fall/benediction");

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorBenediction().update(gameData);
  expect(gameData.benediction).toEqual("green");
});

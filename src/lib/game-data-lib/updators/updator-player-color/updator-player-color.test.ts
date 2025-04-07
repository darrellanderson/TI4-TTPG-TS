import { MockCardHolder } from "ttpg-mock";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { UpdatorPlayerColor } from "./updator-player-color";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerColor;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  const gameData = GameDataUpdator.createGameData();
  new UpdatorPlayerColor().update(gameData);
  expect(gameData.players[0]?.color).toEqual("green");
});

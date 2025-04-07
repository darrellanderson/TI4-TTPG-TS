import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorPlayerActive } from "./updator-player-active";
import { GameData } from "../../game-data/game-data";
import { MockCardHolder } from "ttpg-mock";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerActive;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
  });
  TI4.turnOrder.setPassed(10, true);
  TI4.turnOrder.setPassed(11, false);

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerActive().update(gameData);
  expect(gameData.players[0]?.active).toEqual(false);
  expect(gameData.players[1]?.active).toEqual(true);
});

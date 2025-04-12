import { MockCard, MockCardHolder } from "ttpg-mock";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorPlayerTech } from "./updator-player-tech";
import { GameData } from "../../game-data/game-data";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerTech;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockCard.simple("card.technology.blue:base/antimass-deflectors");
  MockCard.simple("card.technology.bogus:base/_does-not-exist_");

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerTech().update(gameData);
  expect(gameData.players[0]?.technologies).toEqual(["Antimass Deflectors"]);
});

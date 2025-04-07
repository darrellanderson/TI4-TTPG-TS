import { MockCardHolder } from "ttpg-mock";
import { GameDataUpdator } from "../game-data-updator/game-data-updator";
import { UpdatorPlayerColor } from "./updator-player-color";

it("data", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  const gameData = GameDataUpdator.createGameData();
  new UpdatorPlayerColor().update(gameData);
  expect(gameData.players[0]?.color).toEqual("green");
});

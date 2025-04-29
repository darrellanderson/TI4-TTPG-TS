import { Player } from "@tabletop-playground/api";
import { MockCardHolder, MockPlayer, mockWorld } from "ttpg-mock";
import { GameData } from "../../game-data/game-data";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { UpdatorPlayerName } from "./updator-player-name";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerName;
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

  const player10: Player = new MockPlayer({ name: "my-player-name", slot: 10 });
  mockWorld._addPlayer(player10);

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerName().update(gameData);
  expect(gameData.players[0]?.steamName).toEqual("my-player-name");
  expect(gameData.players[1]?.steamName).toEqual("");
});

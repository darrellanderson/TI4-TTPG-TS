import { Player } from "@tabletop-playground/api";
import { MockCardHolder, MockPlayer, mockWorld } from "ttpg-mock";
import { GameData } from "../game-data/game-data";
import { GameDataUpdator } from "../game-data-updator/game-data-updator";
import { UpdatorPlayerName } from "./updator-player-name";

it("data", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const player: Player = new MockPlayer({ name: "my-player-name", slot: 10 });
  mockWorld._addPlayer(player);

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerName().update(gameData);
  expect(gameData.players[0]?.name).toEqual("my-player-name");
});

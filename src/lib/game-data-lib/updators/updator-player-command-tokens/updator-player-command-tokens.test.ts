import { GameData } from "../../game-data/game-data";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorPlayerCommandTokens } from "./updator-player-command-tokens";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { MockCardHolder, MockGameObject } from "ttpg-mock";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerCommandTokens;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  new MockGameObject({
    templateMetadata: "sheet:base/command",
    position: [0, -0.96, 0],
  });

  new MockGameObject({
    id: "tactic",
    templateMetadata: "token.command:base/sol",
    position: [1, 0, 0],
  });

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerCommandTokens().update(gameData);
  expect(gameData).toEqual({
    players: [
      { commandTokens: { fleet: 0, strategy: 0, tactics: 1 } },
      { commandTokens: { fleet: 0, strategy: 0, tactics: 0 } },
      { commandTokens: { fleet: 0, strategy: 0, tactics: 0 } },
      { commandTokens: { fleet: 0, strategy: 0, tactics: 0 } },
      { commandTokens: { fleet: 0, strategy: 0, tactics: 0 } },
      { commandTokens: { fleet: 0, strategy: 0, tactics: 0 } },
    ],
  });
});

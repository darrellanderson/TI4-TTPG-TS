import { MockCardHolder, MockGameObject } from "ttpg-mock";
import { GameData } from "../../game-data/game-data";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { UpdatorPlayerStrategyCards } from "./updator-player-strategy-cards";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerStrategyCards;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  new MockGameObject({
    templateMetadata: "tile.strategy-card:base/leadership",
    name: "Leadership",
  });
  new MockGameObject({
    templateMetadata: "tile.strategy-card:base/diplomacy",
    name: "Diplomacy",
    rotation: [0, 0, 180],
  });

  new MockGameObject({
    templateMetadata: "tile.strategy-card:base/politics",
    name: "Politics",
    position: [100, 0, 0],
  });
  new MockGameObject({
    templateMetadata: "mat:base/strategy-card",
    position: [100, 0, 0],
  });

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerStrategyCards().update(gameData);
  expect(gameData.players[0]).toEqual({
    strategyCards: ["Leadership", "Diplomacy"],
    strategyCardsFaceDown: ["Diplomacy"],
  });
});

it("data, no mat", () => {
  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerStrategyCards().update(gameData);
});

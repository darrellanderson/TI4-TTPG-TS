import { MockCard, MockCardHolder, MockGameObject } from "ttpg-mock";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorPlayerTradegoods } from "./updator-player-tradegoods";
import { GameData } from "../../game-data/game-data";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerTradegoods;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data (simple)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockGameObject.simple("token:base/tradegood-commodity-1");
  MockGameObject.simple("token:base/tradegood-commodity-3", {
    rotation: [0, 0, 180],
  });

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerTradegoods().update(gameData);
  expect(gameData.players[0]).toEqual({
    commodities: 1,
    maxCommodities: 0,
    tradeGoods: 3,
  });
});

it("data (strategy card mat, artuno)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  MockGameObject.simple("token:base/tradegood-commodity-1");

  MockGameObject.simple("mat:base/strategy-card", { position: [100, 0, 0] });
  MockGameObject.simple("token:base/tradegood-commodity-3", {
    position: [100, 0, 0],
  });

  MockCard.simple("card.leader.agent:pok/artuno-the-betrayer", {
    position: [200, 0, 0],
  });
  MockGameObject.simple("token:base/tradegood-commodity-3", {
    position: [200, 0, 0],
  });

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerTradegoods().update(gameData);
  expect(gameData.players[0]).toEqual({
    commodities: 1,
    maxCommodities: 0,
    tradeGoods: 0,
  });
});

it("data (max commodities)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockGameObject.simple("sheet.faction:base/arborec");

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerTradegoods().update(gameData);
  expect(gameData.players[0]).toEqual({
    commodities: 0,
    maxCommodities: 3,
    tradeGoods: 0,
  });
});

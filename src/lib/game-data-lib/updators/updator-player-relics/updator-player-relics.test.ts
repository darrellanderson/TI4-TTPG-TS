import { Card } from "@tabletop-playground/api";
import { MockCard, MockCardHolder } from "ttpg-mock";
import { GameData } from "../../game-data/game-data";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorPlayerRelics } from "./updator-player-relics";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerRelics;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  const holder = new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  holder.setPosition([10, 0, 0], 0);

  const a: Card = MockCard.simple("card.relic:pok/shard-of-the-throne");
  a.setPosition([10, 0, 0], 0);

  const b: Card = MockCard.simple("card.relic:pok/the-crown-of-emphidia");
  b.setPosition([10, 0, 0], 0);

  // Far from player 10 (which is white, player 0)
  const c: Card = MockCard.simple("card.relic:pok/maw-of-worlds");
  c.setPosition([-100, 0, 0], 0);

  const d: Card = MockCard.simple("card.exploration.cultural:pok/cultural-relic-fragment");
  d.setPosition([10, 0, 0], 0);

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerRelics().update(gameData);

  expect(gameData.players[0]?.relics).toBeDefined();
  expect(gameData.players[0]?.relics).toContain("Shard of the Throne");
  expect(gameData.players[0]?.relics).toContain("The Crown of Emphidia");
  expect(gameData.players[0]?.relics).toContain("Cultural Relic Fragment");
  expect(gameData.players[0]?.relics).not.toContain("Maw of Worlds");
});

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

  const holder2 = new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
  });
  holder2.setPosition([110, 0, 0], 0);

  expect(TI4.playerSeats.getPlayerSlotBySeatIndex(0)).toEqual(10);
  expect(TI4.playerSeats.getPlayerSlotBySeatIndex(1)).toEqual(11);

  const a: Card = new MockCard({
    cardDetails: [
      {
        metadata: "card.relic:pok/shard-of-the-throne",
        name: "Shard of the Throne",
      },
    ],
    isFaceUp: true,
  });

  a.setPosition([10, 0, 0], 0);

  const b: Card = new MockCard({
    cardDetails: [
      {
        metadata: "card.relic:pok/the-crown-of-emphidia",
        name: "The Crown of Emphidia",
      },
    ],
    isFaceUp: true,
  });
  b.setPosition([10, 0, 0], 0);

  // Far from player 10 (which is white, player 0)
  const c: Card = new MockCard({
    cardDetails: [
      {
        metadata: "card.relic:pok/maw-of-worlds",
        name: "Maw of Worlds",
      },
    ],
    isFaceUp: true,
  });
  c.setPosition([110, 0, 0], 0);

  const d: Card = new MockCard({
    cardDetails: [
      {
        metadata: "card.exploration.cultural:pok/cultural-relic-fragment",
        name: "Cultural Relic Fragment",
      },
    ],
    isFaceUp: true,
  });
  d.setPosition([10, 0, 0], 0);

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerRelics().update(gameData);

  expect(gameData.players[0]?.relics).toBeDefined();
  expect(gameData.players[0]?.relics.length).toBe(3);
  expect(gameData.players[0]?.relics).toContain("Shard of the Throne");
  expect(gameData.players[0]?.relics).toContain("The Crown of Emphidia");
  expect(gameData.players[0]?.relics).toContain("Cultural Relic Fragment");
  expect(gameData.players[0]?.relics).not.toContain("Maw of Worlds");
});

import {
  MockCard,
  MockCardDetails,
  MockCardHolder,
  MockGameObject,
} from "ttpg-mock";
import { GameData } from "../../game-data/game-data";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorPlayerLeaders } from "./updator-player-leaders";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { Faction } from "../../../faction-lib/faction/faction";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerLeaders;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockGameObject.simple("sheet.faction:base/arborec");

  const faction: Faction | undefined = TI4.factionRegistry.getByPlayerSlot(10);
  if (!faction) {
    throw new Error("Faction not found");
  }

  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.leader.agent:pok/letani-ospha",
      }),
    ],
    isFaceUp: false,
  });

  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.leader.commander:pok/dirzuga-rophal",
      }),
    ],
    isFaceUp: false,
  });

  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.leader.hero:pok/letani-miasmiala",
      }),
    ],
    isFaceUp: false,
  });

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerLeaders().update(gameData);
  expect(gameData).toEqual({
    players: [
      { leaders: { agent: "locked", commander: "locked", hero: "locked" } },
      {
        leaders: { agent: "unlocked", commander: "unlocked", hero: "unlocked" },
      },
      {
        leaders: { agent: "unlocked", commander: "unlocked", hero: "unlocked" },
      },
      {
        leaders: { agent: "unlocked", commander: "unlocked", hero: "unlocked" },
      },
      {
        leaders: { agent: "unlocked", commander: "unlocked", hero: "unlocked" },
      },
      {
        leaders: { agent: "unlocked", commander: "unlocked", hero: "unlocked" },
      },
    ],
  });
});

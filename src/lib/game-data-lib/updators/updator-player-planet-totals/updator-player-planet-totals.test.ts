import { Card } from "@tabletop-playground/api";
import { CardUtil, Find, NSID } from "ttpg-darrell";
import {
  MockCard,
  MockCardDetails,
  MockCardHolder,
  MockGameObject,
} from "ttpg-mock";
import { GameData } from "../../game-data/game-data";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorPlayerPlanetTotals } from "./updator-player-planet-totals";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";

// Systems must exist for registry to know about planets.
beforeEach(() => {
  for (const tile of globalThis.TI4.systemRegistry.getAllSystemTileNumbers()) {
    const nsid: string | undefined =
      globalThis.TI4.systemRegistry.tileNumberToSystemTileObjNsid(tile);
    if (nsid) {
      MockGameObject.simple(nsid, { position: [100, 0, 0] });
    }
  }
});

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerPlanetTotals;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data (simple)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const jord: Card = MockCard.simple("card.planet:base/jord");
  expect(NSID.get(jord)).toEqual("card.planet:base/jord");
  expect(new CardUtil().isLooseCard(jord, true)).toEqual(true);
  expect(new Find().closestOwnedCardHolderOwner(jord.getPosition())).toEqual(
    10
  );

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerPlanetTotals().update(gameData);
  expect(gameData.players[0]).toEqual({
    planetTotals: {
      influence: { avail: 2, total: 2 },
      legendary: 0,
      resources: { avail: 4, total: 4 },
      techs: { blue: 0, green: 0, red: 0, yellow: 0 },
      traits: { cultural: 0, hazardous: 0, industrial: 0 },
      numPlanets: 1,
    },
  });
});

it("data (simple face down)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.planet:base/jord",
      }),
    ],
    isFaceUp: false,
  });

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerPlanetTotals().update(gameData);
  expect(gameData.players[0]).toEqual({
    planetTotals: {
      influence: { avail: 0, total: 2 },
      legendary: 0,
      resources: { avail: 0, total: 4 },
      techs: { blue: 0, green: 0, red: 0, yellow: 0 },
      traits: { cultural: 0, hazardous: 0, industrial: 0 },
      numPlanets: 1,
    },
  });
});

it("data (legendary)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  MockCard.simple("card.planet:pok/primor");

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerPlanetTotals().update(gameData);
  expect(gameData.players[0]).toEqual({
    planetTotals: {
      influence: { avail: 1, total: 1 },
      legendary: 1,
      resources: { avail: 2, total: 2 },
      techs: { blue: 0, green: 0, red: 0, yellow: 0 },
      traits: { cultural: 1, hazardous: 0, industrial: 0 },
      numPlanets: 1,
    },
  });
});

it("data (tech, trait)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  MockCard.simple("card.planet:base/wellon");

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerPlanetTotals().update(gameData);
  expect(gameData.players[0]).toEqual({
    planetTotals: {
      influence: { avail: 2, total: 2 },
      legendary: 0,
      resources: { avail: 1, total: 1 },
      techs: { blue: 0, green: 0, red: 0, yellow: 1 },
      traits: { cultural: 0, hazardous: 0, industrial: 1 },
      numPlanets: 1,
    },
  });
});

import { Card, Player } from "@tabletop-playground/api";
import { Find, HexType, PlayerSlot } from "ttpg-darrell";
import {
  MockCard,
  MockCardHolder,
  MockGameObject,
  MockPlayer,
} from "ttpg-mock";
import { GoalCounter } from "./goal-counter";
import { GameData } from "../game-data/game-data";
import { Faction } from "../../faction-lib/faction/faction";
import { System } from "../../system-lib/system/system";
import { Planet } from "../../system-lib/planet/planet";

beforeEach(() => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [0, 10, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 12,
    position: [0, -10, 0],
  });
});

it("_getSystemHexes", () => {
  MockGameObject.simple("tile.system:base/1");
  const systemHexes: Set<HexType> = new GoalCounter()._getSystemHexes();
  expect(systemHexes.size).toBe(1);
  expect(systemHexes.has("<0,0,0>")).toBe(true);
});

it("_getPlayerSlotToPlanetCards", () => {
  const card: Card = MockCard.simple("card.planet:base/jord");

  const owner: PlayerSlot = new Find().closestOwnedCardHolderOwner([0, 0, 0]);
  expect(owner).toBe(10);

  const counts: Map<
    PlayerSlot,
    Array<Card>
  > = new GoalCounter()._getPlayerSlotToPlanetCards();
  expect(counts.size).toBe(1);
  expect(counts.get(10)).toEqual([card]);
});

it("_getPlayerSlotToHomePlanetCardNsids", () => {
  MockGameObject.simple("tile.system:base/1");
  MockGameObject.simple("sheet.faction:base/sol");

  const playerSlotToHomePlanetCardNsids: Map<
    PlayerSlot,
    Set<string>
  > = new GoalCounter()._getPlayerSlotToHomePlanetCardNsids();
  expect(playerSlotToHomePlanetCardNsids.size).toBe(1);
  expect(playerSlotToHomePlanetCardNsids.get(10)?.size).toBe(1);
  expect(
    playerSlotToHomePlanetCardNsids.get(10)?.has("card.planet:base/jord")
  ).toBe(true);
});

it("_getAllHomePlanetCardNsids", () => {
  MockGameObject.simple("tile.system:base/1");
  MockGameObject.simple("sheet.faction:base/sol");

  const allHomePlanetCardNsids: Set<string> =
    new GoalCounter()._getAllHomePlanetCardNsids();
  expect(allHomePlanetCardNsids.size).toBe(1);
  expect(allHomePlanetCardNsids.has("card.planet:base/jord")).toBe(true);
});

it("countFlagshipsAndWarSuns", () => {
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple("unit:base/flagship", { owningPlayerSlot: 10 });
  MockGameObject.simple("unit:base/war-sun", { owningPlayerSlot: 10 });
  MockGameObject.simple("unit:base/war-sun", { owningPlayerSlot: 10 });
  const counts: Map<PlayerSlot, number> =
    new GoalCounter().countFlagshipsAndWarSuns();
  expect(counts.size).toBe(1);
  expect(counts.get(10)).toBe(3);
});

it("countInfResTgs", () => {
  const gameData: GameData = {
    players: [
      {
        planetTotals: {
          influence: { avail: 0, total: 1 },
          resources: { avail: 0, total: 2 },
          techs: { blue: 0, red: 0, green: 0, yellow: 0 },
          traits: { cultural: 0, hazardous: 0, industrial: 0 },
          legendary: 0,
        },
        tradeGoods: 3,
      },
    ],
  };
  TI4.events.onGameData.trigger(gameData);
  expect(TI4.lastGameData.getLastGameData()).toEqual(gameData);

  const counts: Map<PlayerSlot, { inf: number; res: number; tgs: number }> =
    new GoalCounter().countInfResTgs();
  expect(counts.size).toBe(1);
  expect(counts.get(12)).toEqual({ inf: 1, res: 2, tgs: 3 });
});

it("countMaxNonFighterShipsInSingleSystem", () => {
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple("unit:base/fighter", { owningPlayerSlot: 10 });
  MockGameObject.simple("unit:base/flagship", { owningPlayerSlot: 10 });
  MockGameObject.simple("unit:base/war-sun", { owningPlayerSlot: 10 });

  const counts: Map<PlayerSlot, number> =
    new GoalCounter().countMaxNonFighterShipsInSingleSystem();
  expect(counts.size).toBe(1);
  expect(counts.get(10)).toBe(2);
});

it("countPlanetsAndGetNeighbors", () => {
  MockCard.simple("card.planet:base/jord");

  const counts: Map<
    PlayerSlot,
    { planets: number; neighbors: Array<PlayerSlot> }
  > = new GoalCounter().countPlanetsAndGetNeighbors();
  expect(counts.size).toBe(3);
  expect(counts.get(10)).toEqual({
    planets: 1,
    neighbors: [11, 12],
  });
});

it("countPlanetsInOthersHome", () => {
  MockGameObject.simple("tile.system:base/1", { position: [0, 10, 0] }); // need system tiles to get systems
  MockGameObject.simple("tile.system:base/12", { position: [0, 10, 0] });
  MockCard.simple("card.planet:base/jord");
  MockCard.simple("card.planet:base/jol");
  MockGameObject.simple("sheet.faction:base/sol");
  MockGameObject.simple("sheet.faction:base/jolnar", { position: [0, 10, 0] });

  let faction: Faction | undefined;

  faction = TI4.factionRegistry.getByPlayerSlot(10);
  expect(faction?.getAbbr()).toBe("Sol");
  expect(faction?.getHomeSystemTileNumber()).toBe(1);

  faction = TI4.factionRegistry.getByPlayerSlot(11);
  expect(faction?.getAbbr()).toBe("Jol-Nar");
  expect(faction?.getHomeSystemTileNumber()).toBe(12);

  const playerSlotToPlanetCards: Map<
    PlayerSlot,
    Array<Card>
  > = new GoalCounter()._getPlayerSlotToPlanetCards();
  expect(playerSlotToPlanetCards.size).toBe(1);

  const counts: Map<PlayerSlot, number> =
    new GoalCounter().countPlanetsInOthersHome();
  expect(counts.size).toBe(1);
  expect(counts.get(10)).toBe(1);
});

it("countPlanetsNonHome", () => {
  MockGameObject.simple("tile.system:base/1", { position: [0, 10, 0] }); // need system tiles to get systems
  MockCard.simple("card.planet:base/jord");
  MockCard.simple("card.planet:base/primor");
  MockCard.simple("card.planet:codex.vigil/custodia-vigilia");
  MockGameObject.simple("sheet.faction:base/sol");

  let count: Map<PlayerSlot, number>;

  count = new GoalCounter().countPlanetsNonHome(true);
  expect(count.size).toBe(1);
  expect(count.get(10)).toBe(1);

  count = new GoalCounter().countPlanetsNonHome(false);
  expect(count.size).toBe(1);
  expect(count.get(10)).toBe(2);
});

it("countPlanetTraits", () => {
  const gameData: GameData = {
    players: [
      {
        planetTotals: {
          influence: { avail: 0, total: 0 },
          resources: { avail: 0, total: 0 },
          techs: { blue: 0, red: 0, green: 0, yellow: 0 },
          traits: { cultural: 1, hazardous: 2, industrial: 3 },
          legendary: 0,
        },
      },
    ],
  };
  TI4.events.onGameData.trigger(gameData);
  expect(TI4.lastGameData.getLastGameData()).toEqual(gameData);

  const counts: Map<
    PlayerSlot,
    {
      cultural: number;
      industrial: number;
      hazardous: number;
    }
  > = new GoalCounter().countPlanetTraits();
  expect(counts.size).toBe(1);
  expect(counts.get(12)).toEqual({ cultural: 1, hazardous: 2, industrial: 3 });
});

it("countPlanetsWithAttachments", () => {
  MockGameObject.simple("tile.system:base/18", { position: [0, 10, 0] }); // need system tiles to get systems
  MockCard.simple("card.planet:base/mecatol-rex");
  const attachment1: MockGameObject = MockGameObject.simple(
    "token.attachment.planet:pok/biotic-research-facility",
    { position: [0, 10, 0] }
  );
  const attachment2: MockGameObject = MockGameObject.simple(
    "token.attachment.planet:codex.vigil/custodia-vigilia",
    { position: [0, 10, 0] }
  );

  // Release to attach to a planet.
  const player: Player = new MockPlayer();
  attachment1._releaseAsPlayer(player, false);
  attachment2._releaseAsPlayer(player, false);

  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(18);
  const planet: Planet | undefined = system?.getPlanets()[0];
  expect(planet?.getAttachments().length).toBe(2);

  const counts: Map<PlayerSlot, number> =
    new GoalCounter().countPlanetsWithAttachments();
  expect(counts.size).toBe(1);
  expect(counts.get(10)).toBe(1);
});

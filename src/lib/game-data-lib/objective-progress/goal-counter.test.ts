import { MockCard, MockCardHolder, MockGameObject } from "ttpg-mock";
import { GoalCounter } from "./goal-counter";
import { Find, PlayerSlot } from "ttpg-darrell";
import { GameData } from "../game-data/game-data";
import { Card } from "@tabletop-playground/api";
import { Faction } from "lib/faction-lib/faction/faction";

beforeEach(() => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [0, 0, 10],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 12,
    position: [0, 0, -10],
  });
});

it("countFlagshipsAndWarSuns", () => {
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

  const counts: Map<PlayerSlot, { inf: number; res: number; tgs: number }> =
    new GoalCounter().countInfResTgs();
  expect(counts.size).toBe(1);
  expect(counts.get(10)).toEqual({ inf: 1, res: 2, tgs: 3 });
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

it("_getPlayerSlotToPlanetCards", () => {
  MockCard.simple("card.planet:base/jord");

  const owner: PlayerSlot = new Find().closestOwnedCardHolderOwner([0, 0, 0]);
  expect(owner).toBe(10);

  const counts: Map<
    PlayerSlot,
    Array<Card>
  > = new GoalCounter()._getPlayerSlotToPlanetCards();
  expect(counts.size).toBe(1);
  expect(counts.get(10)).toHaveLength(1);
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
  MockGameObject.simple("tile.system:base/1"); // need system tiles to get systems
  MockGameObject.simple("tile.system:base/12");
  MockCard.simple("card.planet:base/jord");
  MockCard.simple("card.planet:base/jol");
  MockGameObject.simple("sheet.faction:base/sol");
  MockGameObject.simple("sheet.faction:base/jolnar", { position: [0, 0, 10] });

  let faction: Faction | undefined;

  faction = TI4.factionRegistry.getByPlayerSlot(10);
  expect(faction?.getAbbr()).toBe("Sol");

  faction = TI4.factionRegistry.getByPlayerSlot(11);
  expect(faction?.getAbbr()).toBe("Jol-Nar");

  const counts: Map<PlayerSlot, number> =
    new GoalCounter().countPlanetsInOthersHome();
  expect(counts.size).toBe(1);
  expect(counts.get(10)).toBe(1);
});

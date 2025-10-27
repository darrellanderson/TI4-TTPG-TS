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
import { GoalProgress, GoalProgressType } from "./goal-progress";

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

it("_getPlayerSlotToHomeSystemHex", () => {
  MockGameObject.simple("tile.system:base/1");
  MockGameObject.simple("tile.system:base/12", { position: [0, 10, 0] });
  MockGameObject.simple("sheet.faction:base/sol");
  MockGameObject.simple("sheet.faction:base/jolnar", { position: [0, 10, 0] });
  const playerSlotToHomeSystemHex: Map<PlayerSlot, HexType> =
    new GoalCounter()._getPlayerSlotToHomeSystemHex();
  expect(playerSlotToHomeSystemHex.size).toBe(2);
  expect(playerSlotToHomeSystemHex.get(10)?.toString()).toBe("<0,0,0>");
  expect(playerSlotToHomeSystemHex.get(11)?.toString()).toBe("<0,1,-1>");
});

it("_getPlayerSlotToControlledPlanetHexes", () => {
  MockGameObject.simple("tile.system:base/1");
  MockGameObject.simple("unit:base/infantry", { owningPlayerSlot: 10 });
  MockGameObject.simple("unit:base/mech", { owningPlayerSlot: 10 });
  MockGameObject.simple("unit:base/pds", { owningPlayerSlot: 10 });
  MockGameObject.simple("unit:base/space-dock", { owningPlayerSlot: 10 });
  MockGameObject.simple("token.control:base/arborec", { owningPlayerSlot: 10 });
  const playerSlotToControlledPlanetHexes: Map<
    PlayerSlot,
    Set<HexType>
  > = new GoalCounter()._getPlayerSlotToControlledPlanetHexes();
  expect(playerSlotToControlledPlanetHexes.size).toBe(1);
  expect(playerSlotToControlledPlanetHexes.get(10)?.size).toBe(1);
  expect(playerSlotToControlledPlanetHexes.get(10)?.has("<0,0,0>")).toBe(true);
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

  // Also test goal progress.
  const progress: GoalProgressType = new GoalProgress().flagshipOrWarSun(2);
  expect(progress).toEqual({
    header: "Flagship or War Sun",
    values: [undefined, { success: true, value: 3 }],
  });
});

it("countInfResTgs", () => {
  let counts: Map<PlayerSlot, { inf: number; res: number; tgs: number }>;

  // Try with empty player data.
  TI4.events.onGameData.trigger({ players: [{}] });
  counts = new GoalCounter().countInfResTgs();
  expect(counts.size).toBe(1);
  expect(counts.get(12)).toEqual({ inf: 0, res: 0, tgs: 0 });

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

  counts = new GoalCounter().countInfResTgs();
  expect(counts.size).toBe(1);
  expect(counts.get(12)).toEqual({ inf: 1, res: 2, tgs: 3 });

  // Also test goal progress.
  let progress: GoalProgressType;
  progress = new GoalProgress().influence(2);
  expect(progress).toEqual({
    header: "INF/TGS",
    values: [{ success: true, value: "1/3" }],
  });
  progress = new GoalProgress().resources(2);
  expect(progress).toEqual({
    header: "RES/TGS",
    values: [{ success: true, value: "2/3" }],
  });
  progress = new GoalProgress().tradegoods(2);
  expect(progress).toEqual({
    header: "TGS",
    values: [{ success: true, value: 3 }],
  });
  progress = new GoalProgress().infResTgs(3);
  expect(progress).toEqual({
    header: "INF/RES/TGS",
    values: [{ success: false, value: "1/2/3" }],
  });
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

  // Also test goal progress.
  const progress: GoalProgressType =
    new GoalProgress().maxNonFighterShipsInSingleSystem(2);
  expect(progress).toEqual({
    header: "Non-figher ships",
    values: [undefined, { success: true, value: 2 }],
  });
});

it("countPlanetsAndGetNeighbors", () => {
  MockCard.simple("card.planet:base/jord");
  MockCard.simple("card.planet:base/nar");
  MockCard.simple("card.planet:base/jol", { position: [0, 10, 0] });

  const counts: Map<
    PlayerSlot,
    { planets: number; neighbors: Array<PlayerSlot> }
  > = new GoalCounter().countPlanetsAndGetNeighbors();
  expect(counts.size).toBe(3);
  expect(counts.get(10)).toEqual({
    planets: 2,
    neighbors: [11, 12],
  });
  expect(counts.get(11)).toEqual({
    planets: 1,
    neighbors: [12, 10],
  });

  // Also test goal progress.
  const progress: GoalProgressType =
    new GoalProgress().morePlanetsThan2Neighbors();
  expect(progress).toEqual({
    header: "Planets",
    values: [
      { success: false, value: 0 },
      { success: true, value: 2 },
      { success: false, value: 1 },
    ],
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

  // Also test goal progress.
  const progress: GoalProgressType = new GoalProgress().planetsInOthersHome(1);
  expect(progress).toEqual({
    header: "Planets others' home",
    values: [undefined, { success: true, value: 1 }],
  });
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

  // Also test goal progress.
  const progress: GoalProgressType = new GoalProgress().planetsNonHome(
    2,
    false
  );
  expect(progress).toEqual({
    header: "Planets non-home",
    values: [undefined, { success: true, value: 2 }],
  });
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

  // Also test goal progress.
  const progress: GoalProgressType = new GoalProgress().planetsSameTrait(3);
  expect(progress).toEqual({
    header: "CUL/IND/HAZ",
    values: [{ success: true, value: "1/3/2" }],
  });
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

  // Also test goal progress.
  const progress: GoalProgressType = new GoalProgress().planetsWithAttachments(
    1
  );
  expect(progress).toEqual({
    header: "Planets w/attach",
    values: [undefined, { success: true, value: 1 }],
  });
});

it("countPlanetsWithStructuresOutsidePlayersHome", () => {
  MockGameObject.simple("tile.system:base/1", { position: [0, 10, 0] });
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple("sheet.faction:base/sol");
  MockGameObject.simple("unit:base/pds.token", { owningPlayerSlot: 10 });
  MockGameObject.simple("unit:base/pds.token", {
    owningPlayerSlot: 10,
    position: [0, 10, 0],
  });

  const counts: Map<PlayerSlot, number> =
    new GoalCounter().countPlanetsWithStructuresOutsidePlayersHome();
  expect(counts.size).toBe(1);
  expect(counts.get(10)).toBe(1);

  // Also test goal progress.
  const progress: GoalProgressType =
    new GoalProgress().planetsWithStructuresOutsidePlayersHome(1);
  expect(progress).toEqual({
    header: "Planets w/structures non-home",
    values: [undefined, { success: true, value: 1 }],
  });
});

it("countPlanetsWithTechSpecialties", () => {
  MockGameObject.simple("tile.system:base/19", { position: [0, 10, 0] });
  MockCard.simple("card.planet:base/wellon");

  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(19);
  expect(system).toBeDefined();

  const planet: Planet | undefined =
    TI4.systemRegistry.getPlanetByPlanetCardNsid("card.planet:base/wellon");
  expect(planet).toBeDefined();

  const playerSlotToPlanetCards: Map<
    PlayerSlot,
    Array<Card>
  > = new GoalCounter()._getPlayerSlotToPlanetCards();
  expect(playerSlotToPlanetCards.size).toBe(1);
  expect(playerSlotToPlanetCards.get(10)?.length).toBe(1);

  const counts: Map<PlayerSlot, number> =
    new GoalCounter().countPlanetsWithTechSpecialties();
  expect(counts.size).toBe(1);
  expect(counts.get(10)).toBe(1);

  // Also test goal progress.
  const progress: GoalProgressType =
    new GoalProgress().planetsWithTechSpecialties(1);
  expect(progress).toEqual({
    header: "Planets w/tech",
    values: [undefined, { success: true, value: 1 }],
  });
});

it("countStructures", () => {
  MockGameObject.simple("tile.system:base/1", { position: [0, 10, 0] });
  MockGameObject.simple("unit:base/pds.token", { owningPlayerSlot: 10 });

  const counts: Map<PlayerSlot, number> = new GoalCounter().countStructures();
  expect(counts.size).toBe(1);
  expect(counts.get(10)).toBe(1);

  // Also test goal progress.
  const progress: GoalProgressType = new GoalProgress().structures(1);
  expect(progress).toEqual({
    header: "Structures",
    values: [undefined, { success: true, value: 1 }],
  });
});

it("countSystemsWithControlledPlanetsInOrAdjToOthersHome", () => {
  MockGameObject.simple("tile.system:base/1"); // need system tiles to get systems
  MockGameObject.simple("tile.system:base/12", { position: [0, -10, 0] });
  MockGameObject.simple("sheet.faction:base/sol");
  MockGameObject.simple("sheet.faction:base/jolnar", { position: [0, 10, 0] });
  MockGameObject.simple("unit:base/pds", {
    owningPlayerSlot: 10,
  });
  MockGameObject.simple("unit:base/pds", {
    owningPlayerSlot: 10,
    position: [0, 10, 0],
  });

  expect(TI4.factionRegistry.getByPlayerSlot(10)?.getAbbr()).toBe("Sol");
  expect(TI4.factionRegistry.getByPlayerSlot(11)?.getAbbr()).toBe("Jol-Nar");
  expect(TI4.systemRegistry.getBySystemTileNumber(1)).toBeDefined();
  expect(TI4.systemRegistry.getBySystemTileNumber(12)).toBeDefined();

  const counts: Map<PlayerSlot, number> =
    new GoalCounter().countSystemsWithControlledPlanetsInOrAdjToOthersHome();
  expect(counts.size).toBe(1);
  expect(counts.get(10)).toBe(1);

  // Also test goal progress.
  const progress: GoalProgressType =
    new GoalProgress().systemsWithControlledPlanetsInOrAdjToOthersHome(1);
  expect(progress).toEqual({
    header: "Systems",
    values: [undefined, { success: true, value: 1 }],
  });
});

it("countSystemsWithFlagshipOrWarSunAlsoOthersHomeOrMecatol", () => {
  MockGameObject.simple("tile.system:base/18"); // need system tiles to get systems
  MockGameObject.simple("tile.system:base/1", { position: [0, -10, 0] }); // need system tiles to get systems
  MockGameObject.simple("tile.system:base/12", { position: [0, 10, 0] });
  MockGameObject.simple("sheet.faction:base/sol", { position: [0, -10, 0] });
  MockGameObject.simple("sheet.faction:base/jolnar", { position: [0, 10, 0] });
  MockGameObject.simple("unit:base/flagship", {
    owningPlayerSlot: 10,
    position: [0, 0, 0], // mecatol
  });
  MockGameObject.simple("unit:base/war-sun", {
    owningPlayerSlot: 10,
    position: [0, 10, 0], // home system
  });

  const counts: Map<PlayerSlot, number> =
    new GoalCounter().countSystemsWithFlagshipOrWarSunAlsoOthersHomeOrMecatol();
  expect(counts.size).toBe(1);
  expect(counts.get(10)).toBe(2);

  // Also test goal progress.
  const progress: GoalProgressType =
    new GoalProgress().systemsWithFlagshipOrWarSunAlsoOthersHomeOrMecatol(2);
  expect(progress).toEqual({
    header: "Systems",
    values: [undefined, { success: true, value: 2 }],
  });
});

it("countSystemsWithoutPlanetsWithUnits", () => {
  MockGameObject.simple("tile.system:base/39"); // no planets
  MockGameObject.simple("unit:base/fighter", {
    owningPlayerSlot: 10,
  });

  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(39);
  expect(system).toBeDefined();
  expect(system?.getPlanets().length).toBe(0);

  const counts: Map<PlayerSlot, number> =
    new GoalCounter().countSystemsWithoutPlanetsWithUnits();
  expect(counts.size).toBe(1);
  expect(counts.get(10)).toBe(1);

  // Also test goal progress.
  const progress: GoalProgressType =
    new GoalProgress().systemsWithoutPlanetsWithUnits(1);
  expect(progress).toEqual({
    header: "Systems",
    values: [undefined, { success: true, value: 1 }],
  });
});

it("countSystemsWithShipsAdjToMecatol", () => {
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple("tile.system:base/1", {
    position: TI4.hex.toPosition("<1,0,-1>"),
  });
  MockGameObject.simple("unit:base/fighter", {
    position: TI4.hex.toPosition("<1,0,-1>"),
    owningPlayerSlot: 10,
  });

  const counts: Map<PlayerSlot, number> =
    new GoalCounter().countSystemsWithShipsAdjToMecatol();
  expect(counts.size).toBe(1);
  expect(counts.get(10)).toBe(1);

  // Also test goal progress.
  const progress: GoalProgressType =
    new GoalProgress().systemsWithShipsAdjToMecatol(1);
  expect(progress).toEqual({
    header: "Systems",
    values: [undefined, { success: true, value: 1 }],
  });
});

it("countSystemsWithUnitsInLegendaryMecatolOrAnomaly", () => {
  MockGameObject.simple("tile.system:thunders-edge/112", {
    position: [0, 0, 0],
  }); // mecatol
  MockGameObject.simple("tile.system:pok/65", { position: [0, 10, 0] }); // legendary
  MockGameObject.simple("tile.system:base/41", { position: [0, 20, 0] }); // anomaly
  MockGameObject.simple("unit:base/fighter", {
    owningPlayerSlot: 10,
    position: [0, 0, 0],
  });
  MockGameObject.simple("unit:base/fighter", {
    owningPlayerSlot: 10,
    position: [0, 10, 0],
  });
  MockGameObject.simple("unit:base/fighter", {
    owningPlayerSlot: 10,
    position: [0, 20, 0],
  });

  const counts: Map<PlayerSlot, number> =
    new GoalCounter().countSystemsWithUnitsInLegendaryMecatolOrAnomaly();
  expect(counts.size).toBe(1);
  expect(counts.get(10)).toBe(3);

  // Also test goal progress.
  const progress: GoalProgressType =
    new GoalProgress().systemsWithUnitsInLegendaryMecatolOrAnomaly(3);
  expect(progress).toEqual({
    header: "Systems",
    values: [undefined, { success: true, value: 3 }],
  });
});

it("countSystemsWithUnitsOnEdgeOfGameBoardOtherThanHome", () => {
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple("tile.system:base/51", {
    position: TI4.hex.toPosition("<1,0,-1>"),
  }); // off-map
  MockGameObject.simple("unit:base/fighter", {
    position: TI4.hex.toPosition("<1,0,-1>"),
    owningPlayerSlot: 10,
  });

  const counts: Map<PlayerSlot, number> =
    new GoalCounter().countSystemsWithUnitsOnEdgeOfGameBoardOtherThanHome();
  expect(counts.size).toBe(1);
  expect(counts.get(10)).toBe(1);

  // Also test goal progress.
  const progress: GoalProgressType =
    new GoalProgress().systemsWithUnitsOnEdgeOfGameBoardOtherThanHome(1);
  expect(progress).toEqual({
    header: "Systems",
    values: [undefined, { success: true, value: 1 }],
  });
});

it("countTechnologyColors", () => {
  // 2x each for N-in-2-colors check.
  MockCard.simple("card.technology.blue:pok/aetherstream");
  MockCard.simple("card.technology.blue:pok/aetherstream");
  MockCard.simple("card.technology.green:base/bioplasmosis");
  MockCard.simple("card.technology.green:base/bioplasmosis");
  MockCard.simple("card.technology.red:pok/ai-development-algorithm");
  MockCard.simple("card.technology.red:pok/ai-development-algorithm");
  MockCard.simple("card.technology.yellow:pok/aerie-hololattice");
  MockCard.simple("card.technology.yellow:pok/aerie-hololattice");
  MockCard.simple("card.technology.unit-upgrade:base/carrier-2");
  MockCard.simple("card.technology.unit-upgrade:base/carrier-2");

  const counts: Map<
    PlayerSlot,
    { blue: number; green: number; red: number; yellow: number }
  > = new GoalCounter().countTechnologyColors();
  expect(counts.size).toBe(1);
  expect(counts.get(10)).toEqual({
    blue: 2,
    green: 2,
    red: 2,
    yellow: 2,
    unitUpgrade: 2,
  });

  // Also test goal progress.
  let progress: GoalProgressType;
  progress = new GoalProgress().twoTechInColors(2);
  expect(progress).toEqual({
    header: "BLUE/GREEN/YELLOW/RED",
    values: [undefined, { success: true, value: "2/2/2/2" }],
  });
  progress = new GoalProgress().techUnitUpgrades(2);
  expect(progress).toEqual({
    header: "Unit upgrades",
    values: [undefined, { success: true, value: 2 }],
  });
});

it("countTokensInTacticAndStrategy", () => {
  const gameData: GameData = {
    players: [
      {
        commandTokens: {
          fleet: 1,
          strategy: 2,
          tactics: 3,
        },
      },
    ],
  };
  TI4.events.onGameData.trigger(gameData);
  expect(TI4.lastGameData.getLastGameData()).toEqual(gameData);

  const counts = new GoalCounter().countTokensInTacticAndStrategy();
  expect(counts.size).toBe(1);
  expect(counts.get(12)).toEqual(5);

  // Also test goal progress.
  const progress: GoalProgressType =
    new GoalProgress().tokensInTacticAndStrategy(5);
  expect(progress).toEqual({
    header: "Tokens",
    values: [{ success: true, value: 5 }],
  });
});

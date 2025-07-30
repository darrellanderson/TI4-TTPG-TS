import { GameObject, Player } from "@tabletop-playground/api";
import {
  MockCard,
  MockCardHolder,
  MockGameObject,
  MockPlayer,
} from "ttpg-mock";
import {
  ACTION_DEAL_ALLIANCE_CARDS,
  ACTION_DEAL_HOME_SYSTEMS,
  RightClickMinorFactions,
} from "./right-click-minor-factions";
import { Faction } from "../../../lib/faction-lib/faction/faction";

it("_getInPlayFactionHomeSystemNsids", () => {
  const nsid: string = "tile.system:base/1";
  MockGameObject.simple(nsid);

  const rightClickMinorFactions = new RightClickMinorFactions();
  const inPlayFactionHomeSystemNsids =
    rightClickMinorFactions._getInPlayFactionHomeSystemNsids();

  expect(inPlayFactionHomeSystemNsids.size).toBe(1);
  expect(inPlayFactionHomeSystemNsids.has(nsid)).toBe(true);
});

it("_getAllHomeSystemTileNsids", () => {
  const rightClickMinorFactions = new RightClickMinorFactions();
  const all: Set<string> = rightClickMinorFactions._getAllHomeSystemTileNsids();

  expect(all.has("tile.system:base/1")).toBe(true);
  expect(all.has("tile.system:base/2")).toBe(true);
});

it("_getAvailableHomeSystemNsids", () => {
  MockGameObject.simple("tile.system:base/1");

  const rightClickMinorFactions = new RightClickMinorFactions();
  const availableNsids: Array<string> =
    rightClickMinorFactions._getAvailableHomeSystemNsids();
  expect(availableNsids).not.toContain("tile.system:base/1");
  expect(availableNsids).toContain("tile.system:base/2");
});

it("_getHomeSystemTiles", () => {
  const rightClickMinorFactions = new RightClickMinorFactions();
  const homeSystemTiles: Array<GameObject> =
    rightClickMinorFactions._getHomeSystemTiles(2);
  expect(homeSystemTiles.length).toBe(2);
});

it("_dealHomeSystemTiles", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  const rightClickMinorFactions = new RightClickMinorFactions();
  rightClickMinorFactions._dealHomeSystemTiles();
});

it("_findMinorFactionSystemTileObjs", () => {
  const tile1: GameObject = MockGameObject.simple("tile.system:base/1");

  const faction: Faction | undefined =
    TI4.factionRegistry.getByHomeSystemTileNumber(1);
  expect(faction).toBeDefined();

  const rightClickMinorFactions = new RightClickMinorFactions();
  const systemTileObjs: Array<GameObject> =
    rightClickMinorFactions._findMinorFactionSystemTileObjs();
  expect(systemTileObjs.length).toBe(1);
  expect(systemTileObjs).toEqual([tile1]);
});

it("custom action handler", () => {
  const card: MockCard = MockCard.simple(
    "card.event:codex.liberation/minor-factions"
  );

  new RightClickMinorFactions().init();
  process.flushTicks(); // needed for AbstractRightClickCard

  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, ACTION_DEAL_HOME_SYSTEMS);
  card._customActionAsPlayer(player, ACTION_DEAL_ALLIANCE_CARDS);
});

it("_dealAllianceCard", () => {
  const systemTileObj: GameObject = MockGameObject.simple("tile.system:base/1");
  const card: MockCard = MockCard.simple("card.alliance:base/1");
  RightClickMinorFactions._dealAllianceCard(card, systemTileObj);
});

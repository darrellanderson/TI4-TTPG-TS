import { Card, GameObject, Player, Vector } from "@tabletop-playground/api";
import { Adjacency, Find, HexType, NSID } from "ttpg-darrell";
import {
  MockCard,
  MockCardHolder,
  MockGameObject,
  MockPlayer,
  MockSnapPoint,
} from "ttpg-mock";

import { Faction } from "../../faction-lib/faction/faction";
import { System } from "../system/system";
import { SystemAdjacencyWormhole } from "./system-adjacency-wormhole";
import { SystemAdjacency } from "./system-adjacency";
import { UnitModifierActiveIdle } from "../../unit-lib/unit-modifier/unit-modifier-active-idle";

it("static getCombatArenaObj", () => {
  let obj: GameObject | undefined;

  obj = SystemAdjacencyWormhole.getCombatArenaObj();
  expect(obj).toBeUndefined();

  const mat: GameObject = MockGameObject.simple("mat:base/combat-arena");
  obj = SystemAdjacencyWormhole.getCombatArenaObj();
  expect(obj).toBe(mat);

  // Again, find the cached object.
  obj = SystemAdjacencyWormhole.getCombatArenaObj();
  expect(obj).toBe(mat);
});

it("static getSystemHex", () => {
  let hex: HexType;

  const systemTileObj: GameObject = MockGameObject.simple(
    "tile.system:base/25",
    { position: [10, 0, 0] }
  );
  const systemTileHex: HexType = TI4.hex.fromPosition(
    systemTileObj.getPosition()
  );
  expect(systemTileHex).toEqual("<1,0,-1>");
  hex = SystemAdjacencyWormhole.getSystemHex(systemTileObj.getPosition());
  expect(hex).toEqual(systemTileHex);

  const matObj: GameObject = MockGameObject.simple("mat:base/combat-arena", {
    position: [30, 0, 0],
  });
  const matHex: HexType = TI4.hex.fromPosition(matObj.getPosition());
  expect(matHex).toEqual("<2,0,-2>");
  hex = SystemAdjacencyWormhole.getSystemHex(matObj.getPosition());
  expect(hex).toEqual(matHex);

  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(25);
  if (!system) {
    throw new Error("System not found");
  }
  const player: Player = new MockPlayer();
  TI4.events.onSystemActivated.trigger(system, player);

  hex = SystemAdjacencyWormhole.getSystemHex(matObj.getPosition());
  expect(hex).toEqual(systemTileHex);
});

it("constructor", () => {
  new SystemAdjacencyWormhole();
});

it("_getFlagship", () => {
  const flagship: GameObject = MockGameObject.simple("unit:base/flagship", {
    id: "my-flagship",
    owningPlayerSlot: 10,
  });
  expect(flagship.isValid()).toBe(true);
  expect(NSID.get(flagship)).toBe("unit:base/flagship");
  expect(flagship.getOwningPlayerSlot()).toBe(10);

  const found: GameObject | undefined =
    new SystemAdjacencyWormhole()._getFlagship(10);
  expect(found).toBeDefined();
});

it("addTags", () => {
  new MockGameObject({ templateMetadata: "tile.system:base/25" }); // beta

  const hexToSystem: Map<HexType, System> = SystemAdjacency.getHexToSystem();
  const adjacency: Adjacency = new Adjacency();
  const faction: Faction | undefined = undefined;

  new SystemAdjacencyWormhole().addTags(hexToSystem, adjacency, faction);

  expect(
    adjacency.hasLink({
      src: "<0,0,0>",
      dst: "beta",
      distance: 0.5,
      isTransit: true,
    })
  ).toBe(true);
  expect(
    adjacency.hasLink({
      src: "beta",
      dst: "<0,0,0>",
      distance: 0.5,
      isTransit: false,
    })
  ).toBe(true);
});

it("faction creuss", () => {
  const adjacency: Adjacency = new Adjacency();
  const faction: Faction | undefined = TI4.factionRegistry.getByNsid(
    "faction:base/creuss"
  );
  expect(faction).toBeDefined();

  const hexToSystem: Map<HexType, System> = SystemAdjacency.getHexToSystem();
  new SystemAdjacencyWormhole().addTags(hexToSystem, adjacency, faction);
  expect(
    adjacency.hasLink({
      src: "alpha",
      dst: "beta",
      distance: 0,
      isTransit: true,
    })
  ).toBe(true);
});

it("creuss flagship", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 1,
  });
  expect(new Find().closestOwnedCardHolderOwner([0, 0, 0])).toBe(1);

  MockGameObject.simple("sheet.faction:base/creuss");
  TI4.events.onFactionChanged.trigger();
  expect(TI4.factionRegistry.getByPlayerSlot(1)).toBeDefined();

  expect(
    TI4.factionRegistry.getPlayerSlotByFactionNsid("faction:base/creuss")
  ).toBe(1);

  MockGameObject.simple("unit:base/flagship", { owningPlayerSlot: 1 });
  const adjacency: Adjacency = new Adjacency();
  new SystemAdjacencyWormhole()._applyCreussFlagship(adjacency);

  expect(
    adjacency.hasLink({
      src: "<0,0,0>",
      dst: "delta",
      distance: 0.5,
      isTransit: true,
    })
  ).toBe(true);
  expect(
    adjacency.hasLink({
      src: "delta",
      dst: "<0,0,0>",
      distance: 0.5,
      isTransit: false,
    })
  ).toBe(true);
});

it("nekro flagship + z token creuss", () => {
  const systemAdjacencyWormhole: SystemAdjacencyWormhole =
    new SystemAdjacencyWormhole();

  const creussSlot: number = 1;
  const creussPos: Vector = new Vector(50, 0, 0);
  const nekroSlot: number = 2;
  const nekroPos: Vector = new Vector(-50, 0, 0);

  // Player areas.
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: creussSlot,
    position: creussPos,
  });
  expect(new Find().closestOwnedCardHolderOwner(creussPos)).toBe(creussSlot);

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: nekroSlot,
    position: nekroPos,
  });
  expect(new Find().closestOwnedCardHolderOwner(nekroPos)).toBe(nekroSlot);

  // Faction sheets.
  MockGameObject.simple("sheet.faction:base/creuss", { position: creussPos });
  MockGameObject.simple("sheet.faction:base/nekro", { position: nekroPos });
  TI4.events.onFactionChanged.trigger();

  expect(TI4.factionRegistry.getByPlayerSlot(1)?.getNsid()).toBe(
    "faction:base/creuss"
  );
  expect(TI4.factionRegistry.getByPlayerSlot(2)?.getNsid()).toBe(
    "faction:base/nekro"
  );

  // Flagship on a system tile.
  MockGameObject.simple("tile.system:base/18");
  const nekroFlagship: GameObject = MockGameObject.simple(
    "unit:base/flagship",
    { owningPlayerSlot: nekroSlot }
  );
  expect(systemAdjacencyWormhole._getFlagship(nekroSlot)?.getId()).toBe(
    nekroFlagship.getId()
  );

  // Z token in Creuss area.
  expect(systemAdjacencyWormhole._isNekroZTokenInCreussArea()).toBe(false);
  MockGameObject.simple("token:thunders-edge/nekro.z", { position: creussPos });
  expect(systemAdjacencyWormhole._isNekroZTokenInCreussArea()).toBe(true);

  const adjacency: Adjacency = new Adjacency();
  systemAdjacencyWormhole._applyNekroFlagship(adjacency);

  expect(
    adjacency.hasLink({
      src: "<0,0,0>",
      dst: "delta",
      distance: 0.5,
      isTransit: true,
    })
  ).toBe(true);
  expect(
    adjacency.hasLink({
      src: "delta",
      dst: "<0,0,0>",
      distance: 0.5,
      isTransit: false,
    })
  ).toBe(true);
});

it("card wormhole_reconstruction", () => {
  MockCard.simple("card.agenda:base/wormhole-reconstruction");
  const adjacency: Adjacency = new Adjacency();
  new SystemAdjacencyWormhole()._applyCards(adjacency);
  expect(
    adjacency.hasLink({
      src: "alpha",
      dst: "beta",
      distance: 0,
      isTransit: true,
    })
  ).toBe(true);
  expect(
    adjacency.hasLink({
      src: "beta",
      dst: "alpha",
      distance: 0,
      isTransit: true,
    })
  ).toBe(true);
});

it("card wormhole_reconstruction (face down)", () => {
  MockCard.simple("card.agenda:base/wormhole-reconstruction", {
    isFaceUp: false,
  });
  const adjacency: Adjacency = new Adjacency();
  new SystemAdjacencyWormhole()._applyCards(adjacency);
  expect(
    adjacency.hasLink({
      src: "alpha",
      dst: "beta",
      distance: 0,
      isTransit: true,
    })
  ).toBe(false);
  expect(
    adjacency.hasLink({
      src: "beta",
      dst: "alpha",
      distance: 0,
      isTransit: true,
    })
  ).toBe(false);
});

it("card wormhole_reconstruction (in discard)", () => {
  MockCard.simple("card.agenda:base/wormhole-reconstruction", {
    snappedToPoint: new MockSnapPoint({ tags: ["discard-agenda"] }),
  });
  const adjacency: Adjacency = new Adjacency();
  new SystemAdjacencyWormhole()._applyCards(adjacency);
  expect(
    adjacency.hasLink({
      src: "alpha",
      dst: "beta",
      distance: 0,
      isTransit: true,
    })
  ).toBe(false);
  expect(
    adjacency.hasLink({
      src: "beta",
      dst: "alpha",
      distance: 0,
      isTransit: true,
    })
  ).toBe(false);
});

it("card lost_star_chart", () => {
  MockCard.simple("card.action:base/lost-star-chart");
  const adjacency: Adjacency = new Adjacency();
  new SystemAdjacencyWormhole()._applyCards(adjacency);
  expect(
    adjacency.hasLink({
      src: "alpha",
      dst: "beta",
      distance: 0,
      isTransit: true,
    })
  ).toBe(true);
  expect(
    adjacency.hasLink({
      src: "beta",
      dst: "alpha",
      distance: 0,
      isTransit: true,
    })
  ).toBe(true);
});

it("card lost_star_chart (face down)", () => {
  MockCard.simple("card.action:base/lost-star-chart", {
    isFaceUp: false,
  });
  const adjacency: Adjacency = new Adjacency();
  new SystemAdjacencyWormhole()._applyCards(adjacency);
  expect(
    adjacency.hasLink({
      src: "alpha",
      dst: "beta",
      distance: 0,
      isTransit: true,
    })
  ).toBe(false);
  expect(
    adjacency.hasLink({
      src: "beta",
      dst: "alpha",
      distance: 0,
      isTransit: true,
    })
  ).toBe(false);
});

it("card lost_star_chart (in discard)", () => {
  MockCard.simple("card.action:base/lost-star-chart", {
    snappedToPoint: new MockSnapPoint({ tags: ["discard-action"] }),
  });
  const adjacency: Adjacency = new Adjacency();
  new SystemAdjacencyWormhole()._applyCards(adjacency);
  expect(
    adjacency.hasLink({
      src: "alpha",
      dst: "beta",
      distance: 0,
      isTransit: true,
    })
  ).toBe(false);
  expect(
    adjacency.hasLink({
      src: "beta",
      dst: "alpha",
      distance: 0,
      isTransit: true,
    })
  ).toBe(false);
});

it("card emissary_taivra (active)", () => {
  let adjacency: Adjacency;
  adjacency = new Adjacency();
  const card: Card = MockCard.simple("card.leader.agent:pok/emissary-taivra");
  expect(UnitModifierActiveIdle.isActive(card)).toBe(false);

  adjacency = new Adjacency();
  new SystemAdjacencyWormhole()._applyCards(adjacency);
  expect(UnitModifierActiveIdle.isActive(card)).toBe(false);
  expect(
    adjacency.hasLink({
      src: "alpha",
      dst: "delta",
      distance: 0,
      isTransit: true,
    })
  ).toBe(false);
  expect(
    adjacency.hasLink({
      src: "delta",
      dst: "alpha",
      distance: 0,
      isTransit: true,
    })
  ).toBe(false);

  UnitModifierActiveIdle.setActive(card, true);
  adjacency = new Adjacency();
  new SystemAdjacencyWormhole()._applyCards(adjacency);
  expect(UnitModifierActiveIdle.isActive(card)).toBe(true);
  expect(
    adjacency.hasLink({
      src: "alpha",
      dst: "delta",
      distance: 0,
      isTransit: true,
    })
  ).toBe(true);
  expect(
    adjacency.hasLink({
      src: "delta",
      dst: "alpha",
      distance: 0,
      isTransit: true,
    })
  ).toBe(true);
});

it("_useWormhole", () => {
  const adjacency: SystemAdjacencyWormhole = new SystemAdjacencyWormhole();
  const wormhole = "epsilon";
  let faction = new Faction(
    {
      source: "my-source",
      packageId: "my-package-id",
    },
    {
      name: "My Faction",
      nsidName: "my-factin",
      abbr: "my-abbr",
      abilities: [],
      leaders: { agents: [], commanders: [], heroes: [], mechs: [] },
      home: 1,
      commodities: 3,
      promissories: [],
      factionTechs: [],
      startingTechs: [],
      startingUnits: {},
      unitOverrides: [],
    }
  );

  expect(adjacency._useWormhole(wormhole, faction)).toBe(false);

  faction = new Faction(
    {
      source: "my-source",
      packageId: "my-package-id",
    },
    {
      name: "My Faction",
      nsidName: "my-factin",
      abbr: "my-abbr",
      abilities: ["sundered"],
      leaders: { agents: [], commanders: [], heroes: [], mechs: [] },
      home: 1,
      commodities: 3,
      promissories: [],
      factionTechs: [],
      startingTechs: [],
      startingUnits: {},
      unitOverrides: [],
    }
  );

  expect(adjacency._useWormhole(wormhole, faction)).toBe(true);
});

import { Card, GameObject, Player } from "@tabletop-playground/api";
import { Adjacency, HexType } from "ttpg-darrell";
import { MockCard, MockGameObject, MockPlayer, MockSnapPoint } from "ttpg-mock";

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
  MockGameObject.simple("unit.flagship:base/creuss");
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

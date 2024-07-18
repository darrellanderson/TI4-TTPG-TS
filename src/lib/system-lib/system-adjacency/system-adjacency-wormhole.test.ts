import { Card, GameObject } from "@tabletop-playground/api";
import { Adjacency, HexType } from "ttpg-darrell";
import { MockCard, MockGameObject, MockSnapPoint } from "ttpg-mock";

import { System } from "../system/system";
import { SystemAdjacencyWormhole } from "./system-adjacency-wormhole";
import { SystemAdjacency } from "./system-adjacency";
import { UnitModifierActiveIdle } from "../../unit-lib/unit-modifier/unit-modifier-active-idle";

it("constructor", () => {
  new SystemAdjacencyWormhole();
});

it("addTags", () => {
  new MockGameObject({ templateMetadata: "tile.system:base/25" }); // beta

  const hexToSystem: Map<HexType, System> = SystemAdjacency.getHexToSystem();
  const adjacency: Adjacency = new Adjacency();

  new SystemAdjacencyWormhole().addTags(hexToSystem, adjacency);

  expect(adjacency.hasLink("alpha", "alpha")).toBe(true);
  expect(adjacency.hasLink("beta", "beta")).toBe(true);
  expect(adjacency.hasNodeTag("<0,0,0>", "alpha")).toBe(false);
  expect(adjacency.hasNodeTag("<0,0,0>", "beta")).toBe(true);
});

it("creuss flagship", () => {
  const flagship: GameObject = MockGameObject.simple(
    "unit.flagship:base/creuss"
  );
  const hex: HexType = TI4.hex.fromPosition(flagship.getPosition());
  const adjacency: Adjacency = new Adjacency();
  expect(adjacency.hasNodeTag(hex, "delta")).toBe(false);
  new SystemAdjacencyWormhole()._applyCreussFlagship(adjacency);
  expect(adjacency.hasNodeTag(hex, "delta")).toBe(true);
});

it("card wormhole_reconstruction", () => {
  MockCard.simple("card.agenda:base/wormhole_reconstruction");
  const adjacency: Adjacency = new Adjacency();
  expect(adjacency.hasLink("alpha", "beta")).toBe(false);
  new SystemAdjacencyWormhole()._applyCards(adjacency);
  expect(adjacency.hasLink("alpha", "beta")).toBe(true);
});

it("card wormhole_reconstruction (face down)", () => {
  MockCard.simple("card.agenda:base/wormhole_reconstruction", {
    isFaceUp: false,
  });
  const adjacency: Adjacency = new Adjacency();
  expect(adjacency.hasLink("alpha", "beta")).toBe(false);
  new SystemAdjacencyWormhole()._applyCards(adjacency);
  expect(adjacency.hasLink("alpha", "beta")).toBe(false);
});

it("card wormhole_reconstruction (in discard)", () => {
  MockCard.simple("card.agenda:base/wormhole_reconstruction", {
    snappedToPoint: new MockSnapPoint({ tags: ["discard.card.agenda"] }),
  });
  const adjacency: Adjacency = new Adjacency();
  expect(adjacency.hasLink("alpha", "beta")).toBe(false);
  new SystemAdjacencyWormhole()._applyCards(adjacency);
  expect(adjacency.hasLink("alpha", "beta")).toBe(false);
});

it("card lost_star_chart", () => {
  MockCard.simple("card.action:base/lost_star_chart");
  const adjacency: Adjacency = new Adjacency();
  expect(adjacency.hasLink("alpha", "beta")).toBe(false);
  new SystemAdjacencyWormhole()._applyCards(adjacency);
  expect(adjacency.hasLink("alpha", "beta")).toBe(true);
});

it("card lost_star_chart (face down)", () => {
  MockCard.simple("card.action:base/lost_star_chart", {
    isFaceUp: false,
  });
  const adjacency: Adjacency = new Adjacency();
  expect(adjacency.hasLink("alpha", "beta")).toBe(false);
  new SystemAdjacencyWormhole()._applyCards(adjacency);
  expect(adjacency.hasLink("alpha", "beta")).toBe(false);
});

it("card lost_star_chart (in discard)", () => {
  MockCard.simple("card.action:base/lost_star_chart", {
    snappedToPoint: new MockSnapPoint({ tags: ["discard.card.action"] }),
  });
  const adjacency: Adjacency = new Adjacency();
  expect(adjacency.hasLink("alpha", "beta")).toBe(false);
  new SystemAdjacencyWormhole()._applyCards(adjacency);
  expect(adjacency.hasLink("alpha", "beta")).toBe(false);
});

it("card emissary_taivra (active)", () => {
  let adjacency: Adjacency;
  adjacency = new Adjacency();
  expect(adjacency.hasLink("alpha", "delta")).toBe(false);

  const card: Card = MockCard.simple(
    "card.leader.agent.creuss:pok/emissary_taivra"
  );
  expect(UnitModifierActiveIdle.isActive(card)).toBe(true);
  UnitModifierActiveIdle.setActive(card, false);

  adjacency = new Adjacency();
  new SystemAdjacencyWormhole()._applyCards(adjacency);
  expect(UnitModifierActiveIdle.isActive(card)).toBe(false);
  expect(adjacency.hasLink("alpha", "delta")).toBe(false);

  UnitModifierActiveIdle.setActive(card, true);
  adjacency = new Adjacency();
  new SystemAdjacencyWormhole()._applyCards(adjacency);
  expect(UnitModifierActiveIdle.isActive(card)).toBe(true);
  expect(adjacency.hasLink("alpha", "delta")).toBe(true);
});

import { Adjacency, HexType } from "ttpg-darrell";
import { MockCard, MockGameObject, MockSnapPoint } from "ttpg-mock";

import { System } from "../system/system";
import { SystemAdjacencyWormhole } from "./system-adjacency-wormhole";
import { SystemAdjacency } from "./system-adjacency";
import { resetGlobalThisTI4 } from "../../../global/global";
import { Card } from "@tabletop-playground/api";

it("constructor", () => {
  new SystemAdjacencyWormhole();
});

it("addTags", () => {
  resetGlobalThisTI4();
  new MockGameObject({ templateMetadata: "tile.system:base/25" }); // beta

  const hexToSystem: Map<HexType, System> = SystemAdjacency.getHexToSystem();
  const adjacency: Adjacency = new Adjacency();

  new SystemAdjacencyWormhole().addTags(hexToSystem, adjacency);

  expect(adjacency.hasLink("alpha", "alpha")).toBe(true);
  expect(adjacency.hasLink("beta", "beta")).toBe(true);
  expect(adjacency.hasNodeTag("<0,0,0>", "alpha")).toBe(false);
  expect(adjacency.hasNodeTag("<0,0,0>", "beta")).toBe(true);
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

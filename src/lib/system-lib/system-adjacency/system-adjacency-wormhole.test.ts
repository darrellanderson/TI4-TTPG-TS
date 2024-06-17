import { Adjacency, HexType } from "ttpg-darrell";
import { MockGameObject } from "ttpg-mock";

import { System } from "../system/system";
import { SystemAdjacencyWormhole } from "./system-adjacency-wormhole";
import { SystemAdjacency } from "./system-adjacency";
import { resetGlobalThisTI4 } from "../../../global/global";

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

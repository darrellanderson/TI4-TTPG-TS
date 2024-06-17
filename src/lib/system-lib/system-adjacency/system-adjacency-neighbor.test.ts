import { MockGameObject } from "ttpg-mock";
import { Adjacency, HexType } from "ttpg-darrell";

import { System } from "../system/system";
import { SystemAdjacency } from "./system-adjacency";
import { SystemAdjacencyNeighbor } from "./system-adjacency-neighbor";
import { resetGlobalThisTI4 } from "../../../global/global";

it("constructor", () => {
  new SystemAdjacencyNeighbor();
});

it("addTags", () => {
  resetGlobalThisTI4();
  new MockGameObject({
    position: TI4.hex.toPosition("<0,0,0>"),
    templateMetadata: "tile.system:base/1",
  });
  new MockGameObject({
    position: TI4.hex.toPosition("<1,0,-1>"),
    templateMetadata: "tile.system:base/2",
  });
  const hexToSystem: Map<HexType, System> = SystemAdjacency.getHexToSystem();
  expect(hexToSystem.get("<0,0,0>")?.getSystemTileNumber()).toBe(1);
  expect(hexToSystem.get("<1,0,-1>")?.getSystemTileNumber()).toBe(2);

  const adjacency: Adjacency = new Adjacency();
  new SystemAdjacencyNeighbor().addTags(hexToSystem, adjacency);
  expect(adjacency.hasNodeTag("<0,0,0>", "<0,0,0>-<1,0,-1>")).toBe(true);
  expect(adjacency.hasNodeTag("<1,0,-1>", "<0,0,0>-<1,0,-1>")).toBe(true);
  expect(adjacency.hasLink("<0,0,0>-<1,0,-1>", "<0,0,0>-<1,0,-1>")).toBe(true);
});

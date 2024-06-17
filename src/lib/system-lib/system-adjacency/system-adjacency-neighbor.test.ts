import { MockGameObject } from "ttpg-mock";
import { Adjacency, AdjacencyResult, HexType } from "ttpg-darrell";

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
  new MockGameObject({
    position: TI4.hex.toPosition("<2,0,-2>"),
    templateMetadata: "tile.system:base/3",
  });
  new MockGameObject({
    position: TI4.hex.toPosition("<3,0,-3>"),
    templateMetadata: "tile.system:base/51", // off-map, never a neighbor
  });
  const hexToSystem: Map<HexType, System> = SystemAdjacency.getHexToSystem();
  expect(hexToSystem.get("<0,0,0>")?.getSystemTileNumber()).toBe(1);
  expect(hexToSystem.get("<1,0,-1>")?.getSystemTileNumber()).toBe(2);
  expect(hexToSystem.get("<2,0,-2>")?.getSystemTileNumber()).toBe(3);

  const adjacency: Adjacency = new Adjacency();
  new SystemAdjacencyNeighbor().addTags(hexToSystem, adjacency);

  expect(adjacency.hasNodeTag("<0,0,0>", "<0,0,0>-<1,0,-1>")).toBe(true);
  expect(adjacency.hasNodeTag("<1,0,-1>", "<0,0,0>-<1,0,-1>")).toBe(true);
  expect(adjacency.hasLink("<0,0,0>-<1,0,-1>", "<0,0,0>-<1,0,-1>")).toBe(true);

  expect(adjacency.hasNodeTag("<1,0,-1>", "<1,0,-1>-<2,0,-2>")).toBe(true);
  expect(adjacency.hasNodeTag("<2,0,-2>", "<1,0,-1>-<2,0,-2>")).toBe(true);
  expect(adjacency.hasLink("<1,0,-1>-<2,0,-2>", "<1,0,-1>-<2,0,-2>")).toBe(
    true
  );

  // Verify adjacency is being used correctly.
  const paths: Array<AdjacencyResult> = adjacency.get("<0,0,0>", 100);
  expect(paths).toEqual([
    { distance: 0, node: "<0,0,0>", path: ["<0,0,0>"] },
    { distance: 1, node: "<1,0,-1>", path: ["<0,0,0>", "<1,0,-1>"] },
    {
      distance: 2,
      node: "<2,0,-2>",
      path: ["<0,0,0>", "<1,0,-1>", "<2,0,-2>"],
    },
  ]);
});

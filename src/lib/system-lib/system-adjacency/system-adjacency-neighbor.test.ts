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

  expect(adjacency.hasNodeTag("<0,0,0>", "<0,0,0>|<1,0,-1>")).toBe(true);
  expect(adjacency.hasNodeTag("<1,0,-1>", "<0,0,0>|<1,0,-1>")).toBe(true);
  expect(adjacency.hasLink("<0,0,0>|<1,0,-1>", "<0,0,0>|<1,0,-1>")).toBe(true);

  expect(adjacency.hasNodeTag("<1,0,-1>", "<1,0,-1>|<2,0,-2>")).toBe(true);
  expect(adjacency.hasNodeTag("<2,0,-2>", "<1,0,-1>|<2,0,-2>")).toBe(true);
  expect(adjacency.hasLink("<1,0,-1>|<2,0,-2>", "<1,0,-1>|<2,0,-2>")).toBe(
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

it("hyperlanes are other systems' neighbors", () => {
  resetGlobalThisTI4();
  new MockGameObject({
    position: TI4.hex.toPosition("<0,0,0>"),
    templateMetadata: "tile.system:base/1",
  });
  new MockGameObject({
    position: TI4.hex.toPosition("<1,0,-1>"),
    templateMetadata: "tile.system:pok/83", // hyperlane
  });
  const hexToSystem: Map<HexType, System> = SystemAdjacency.getHexToSystem();
  expect(hexToSystem.get("<0,0,0>")?.getSystemTileNumber()).toBe(1);
  expect(hexToSystem.get("<1,0,-1>")?.getSystemTileNumber()).toBe(83);

  const adjacency: Adjacency = new Adjacency();
  new SystemAdjacencyNeighbor().addTags(hexToSystem, adjacency);

  expect(adjacency.hasNodeTag("<0,0,0>", "<0,0,0>|<1,0,-1>")).toBe(true); // normal outgoing
  expect(adjacency.hasNodeTag("<1,0,-1>", "<0,0,0>|<1,0,-1>")).toBe(false); // hyperlane outgoing
  expect(adjacency.hasLink("<0,0,0>|<1,0,-1>", "<0,0,0>|<1,0,-1>")).toBe(true);
});

it("neighbors must share same system class", () => {
  const hexToSystem: Map<HexType, System> = SystemAdjacency.getHexToSystem();
  hexToSystem.set(
    "<0,0,0>",
    new System(
      new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
      { source: "my-source", packageId: "my-package-id" },
      { tile: 1000 }
    )
  );
  hexToSystem.set(
    "<1,0,-1>",
    new System(
      new MockGameObject({ templateMetadata: "tile.system:my-source/1001" }),
      { source: "my-source", packageId: "my-package-id" },
      { tile: 1001 }
    )
  );
  hexToSystem.set(
    "<2,0,-2>",
    new System(
      new MockGameObject({ templateMetadata: "tile.system:my-source/1002" }),
      { source: "my-source", packageId: "my-package-id" },
      { tile: 1002 }
    )
  );
  hexToSystem.set(
    "<3,0,-3>",
    new System(
      new MockGameObject({ templateMetadata: "tile.system:my-source/1003" }),
      { source: "my-source", packageId: "my-package-id" },
      { tile: 1003 }
    )
  );

  let adjacency: Adjacency = new Adjacency();
  new SystemAdjacencyNeighbor().addTags(hexToSystem, adjacency);

  // All share same tag.
  expect(adjacency.hasNodeTag("<0,0,0>", "<0,0,0>|<1,0,-1>")).toBe(true);
  expect(adjacency.hasNodeTag("<1,0,-1>", "<1,0,-1>|<2,0,-2>")).toBe(true);
  expect(adjacency.hasNodeTag("<2,0,-2>", "<2,0,-2>|<3,0,-3>")).toBe(true);

  // Reset last two to have different system class.
  hexToSystem.set(
    "<2,0,-2>",
    new System(
      new MockGameObject({ templateMetadata: "tile.system:my-source/1002" }),
      { source: "my-source", packageId: "my-package-id" },
      { tile: 1002, class: "alt" }
    )
  );
  hexToSystem.set(
    "<3,0,-3>",
    new System(
      new MockGameObject({ templateMetadata: "tile.system:my-source/1003" }),
      { source: "my-source", packageId: "my-package-id" },
      { tile: 1003, class: "alt" }
    )
  );

  adjacency = new Adjacency();
  new SystemAdjacencyNeighbor().addTags(hexToSystem, adjacency);

  // First two and last two differ.
  expect(adjacency.hasNodeTag("<0,0,0>", "<0,0,0>|<1,0,-1>")).toBe(true);
  expect(adjacency.hasNodeTag("<1,0,-1>", "<1,0,-1>|<2,0,-2>")).toBe(false); // split here
  expect(adjacency.hasNodeTag("<2,0,-2>", "<2,0,-2>|<3,0,-3>")).toBe(true);
});

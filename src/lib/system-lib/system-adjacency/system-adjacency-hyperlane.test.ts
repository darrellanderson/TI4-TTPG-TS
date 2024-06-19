import { GameObject, Vector } from "@tabletop-playground/api";
import { MockGameObject } from "ttpg-mock";
import { Adjacency, AdjacencyResult, Hex, HexType } from "ttpg-darrell";

import { SystemAdjacencyHyperlane } from "./system-adjacency-hyperlane";
import { System } from "../system/system";
import { resetGlobalThisTI4 } from "../../../global/global";
import { SystemAdjacencyNeighbor } from "./system-adjacency-neighbor";

it("static yawToShift", () => {
  // Round to nearest 60 degrees.
  expect(SystemAdjacencyHyperlane.yawToShift(-1)).toBe(0);
  expect(SystemAdjacencyHyperlane.yawToShift(0)).toBe(0);
  expect(SystemAdjacencyHyperlane.yawToShift(1)).toBe(0);

  expect(SystemAdjacencyHyperlane.yawToShift(59)).toBe(1);
  expect(SystemAdjacencyHyperlane.yawToShift(60)).toBe(1);
  expect(SystemAdjacencyHyperlane.yawToShift(61)).toBe(1);

  expect(SystemAdjacencyHyperlane.yawToShift(359)).toBe(0);
  expect(SystemAdjacencyHyperlane.yawToShift(360)).toBe(0);
  expect(SystemAdjacencyHyperlane.yawToShift(361)).toBe(0);
});

it("static neighborsWithRotAndFlip", () => {
  const defaultNeighbors: Array<HexType> = Hex.neighbors("<0,0,0>");
  let neighbors: Array<HexType>;

  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:my-source/1000",
  });
  const system: System = new System(
    systemTileObj,
    { source: "my-source", packageId: "my-package-id" },
    { tile: 1000 }
  );
  // First is "above", winding counterclockwise.
  neighbors = SystemAdjacencyHyperlane.neighborsWithRotAndFlip(
    "<0,0,0>",
    system
  );
  expect(neighbors[0]).toEqual(defaultNeighbors[0]);
  expect(neighbors[1]).toEqual(defaultNeighbors[1]);

  systemTileObj.setRotation([0, 60, 0]);
  neighbors = SystemAdjacencyHyperlane.neighborsWithRotAndFlip(
    "<0,0,0>",
    system
  );
  expect(neighbors[0]).toEqual(defaultNeighbors[1]);
  expect(neighbors[1]).toEqual(defaultNeighbors[2]);

  systemTileObj.setRotation([0, 60, -180]);
  neighbors = SystemAdjacencyHyperlane.neighborsWithRotAndFlip(
    "<0,0,0>",
    system
  );
  expect(neighbors[0]).toEqual(defaultNeighbors[5]);
  expect(neighbors[1]).toEqual(defaultNeighbors[0]);

  systemTileObj.setRotation([0, 300, 0]);
  neighbors = SystemAdjacencyHyperlane.neighborsWithRotAndFlip(
    "<0,0,0>",
    system
  );
  expect(neighbors[0]).toEqual(defaultNeighbors[5]);
  expect(neighbors[1]).toEqual(defaultNeighbors[0]);

  systemTileObj.setRotation([0, 300, -180]);
  neighbors = SystemAdjacencyHyperlane.neighborsWithRotAndFlip(
    "<0,0,0>",
    system
  );
  expect(neighbors[0]).toEqual(defaultNeighbors[1]);
  expect(neighbors[1]).toEqual(defaultNeighbors[2]);
});

it("addTags", () => {
  resetGlobalThisTI4();
  const adjacency: Adjacency = new Adjacency();

  const dirToHex: Record<string, HexType> = {
    n: "<1,0,-1>",
    nw: "<1,-1,0>",
    sw: "<0,-1,1>",
    s: "<-1,0,1>",
    se: "<-1,1,0>",
    ne: "<0,1,-1>",
  };

  // Add neighbor systems.
  const hexToSystem: Map<HexType, System> = new Map<HexType, System>();
  for (const hex of Object.values(dirToHex)) {
    const tile: number = 1000 + hexToSystem.size;
    hexToSystem.set(
      hex,
      new System(
        new MockGameObject({
          templateMetadata: `tile.system:my-source/${tile}`,
        }),
        { source: "my-source", packageId: "my-package-id" },
        { tile }
      )
    );
  }

  // Add sw-ne hyperlane system (center).  All systems must be registerd with
  // hexToSystem for SystemAdjaencyNeighbor to add links.
  new MockGameObject({
    templateMetadata: "tile.system:pok/83",
  });
  const hyperlaneSystem: System | undefined = TI4.systemRegistry.getByPosition(
    new Vector(0, 0, 0)
  );
  if (hyperlaneSystem) {
    hexToSystem.set("<0,0,0>", hyperlaneSystem);
  }

  // Register the "neighbor" systems with neighbor tags.
  new SystemAdjacencyNeighbor().addTags(hexToSystem, adjacency);
  expect(adjacency.hasNodeTag("<0,-1,1>", "<0,-1,1>|<0,0,0>")).toBe(true);

  // Register hyperlane nodes and links.
  new SystemAdjacencyHyperlane().addTags(hexToSystem, adjacency);
  expect(adjacency.hasTransitNode("<0,0,0>-sw")).toBe(true);
  expect(adjacency.hasTransitNode("<0,0,0>-ne")).toBe(true);
  expect(adjacency.hasNodeTag("<0,0,0>-sw", "<0,-1,1>|<0,0,0>")).toBe(true);
  expect(adjacency.hasNodeTag("<0,0,0>-sw", "<0,0,0>|<0,1,-1>")).toBe(true);
  expect(adjacency.hasNodeTag("<0,0,0>-ne", "<0,-1,1>|<0,0,0>")).toBe(true);
  expect(adjacency.hasNodeTag("<0,0,0>-ne", "<0,0,0>|<0,1,-1>")).toBe(true);

  // Verify adjacency is being used correctly.
  const paths: Array<AdjacencyResult> = adjacency.get("<0,-1,1>", 1);
  expect(paths).toEqual([
    { distance: 0, node: "<0,-1,1>", path: ["<0,-1,1>"] },
    { distance: 1, node: "<-1,0,1>", path: ["<0,-1,1>", "<-1,0,1>"] }, // neighbor
    {
      distance: 1,
      node: "<0,1,-1>",
      path: ["<0,-1,1>", "<0,0,0>-ne", "<0,0,0>-sw", "<0,1,-1>"], // hyperlane transit
    },
    { distance: 1, node: "<1,-1,0>", path: ["<0,-1,1>", "<1,-1,0>"] }, // neighbor
  ]);

  // Hyperlane hex (without which-edge annotation) has no non-self adjacency.
  expect(adjacency.get("<0,0,0>", 2)).toEqual([
    { distance: 0, node: "<0,0,0>", path: ["<0,0,0>"] },
  ]);
});

it("addTags (rotated hyperlane)", () => {
  resetGlobalThisTI4();
  const hexToSystem: Map<HexType, System> = new Map<HexType, System>();
  const adjacency: Adjacency = new Adjacency();

  // Add sw-ne hyperlane system.
  new MockGameObject({
    templateMetadata: "tile.system:pok/83",
    rotation: [0, 60, 0],
  });
  const hyperlaneSystem: System | undefined = TI4.systemRegistry.getByPosition(
    new Vector(0, 0, 0)
  );
  if (hyperlaneSystem) {
    hexToSystem.set("<0,0,0>", hyperlaneSystem);
  }

  // Register hyperlane nodes and links.
  new SystemAdjacencyHyperlane().addTags(hexToSystem, adjacency);
  expect(adjacency.hasTransitNode("<0,0,0>-sw")).toBe(true); // sw relative to rotated
  expect(adjacency.hasTransitNode("<0,0,0>-ne")).toBe(true);
  expect(adjacency.hasNodeTag("<0,0,0>-sw", "<-1,0,1>|<0,0,0>")).toBe(true);
  expect(adjacency.hasNodeTag("<0,0,0>-sw", "<0,0,0>|<1,0,-1>")).toBe(true);
  expect(adjacency.hasNodeTag("<0,0,0>-ne", "<-1,0,1>|<0,0,0>")).toBe(true);
  expect(adjacency.hasNodeTag("<0,0,0>-ne", "<0,0,0>|<1,0,-1>")).toBe(true);
});

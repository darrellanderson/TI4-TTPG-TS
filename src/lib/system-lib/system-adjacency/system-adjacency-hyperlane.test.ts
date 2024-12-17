import { GameObject, Vector } from "@tabletop-playground/api";
import { MockGameObject } from "ttpg-mock";
import {
  Adjacency,
  AdjacencyNodeType,
  AdjacencyPathType,
  Hex,
  HexType,
} from "ttpg-darrell";

import {
  DirectionToNeighborHexType,
  SystemAdjacencyHyperlane,
} from "./system-adjacency-hyperlane";
import { System } from "../system/system";
import { SystemAdjacencyNeighbor } from "./system-adjacency-neighbor";
import { SystemAdjacency } from "./system-adjacency";

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

it("static getDirectionToNeighbor", () => {
  const neighbors: Array<HexType> = Hex.neighbors("<0,0,0>");
  const directionToNeighbor: DirectionToNeighborHexType =
    SystemAdjacencyHyperlane._getDirectionToNeighbor(neighbors);
  expect(directionToNeighbor).toEqual({
    n: "<1,0,-1>",
    nw: "<1,-1,0>",
    sw: "<0,-1,1>",
    s: "<-1,0,1>",
    se: "<-1,1,0>",
    ne: "<0,1,-1>",
  });
});

it("static getDirectionToNeighbor (throw)", () => {
  expect(() => {
    SystemAdjacencyHyperlane._getDirectionToNeighbor([]);
  }).toThrow();

  expect(() => {
    SystemAdjacencyHyperlane._getDirectionToNeighbor([
      "<0,0,0>", // 1
      "<0,0,0>", // 2
      "<0,0,0>", // 3
      "<0,0,0>", // 4
      "<0,0,0>", // 5
      "<0,0,0>", // 6
      "<0,0,0>", // 7 is too many!
    ]);
  }).toThrow();
});

it("static _localNeighborsWithRotAndFlip", () => {
  const globalNeighbors: DirectionToNeighborHexType =
    SystemAdjacencyHyperlane._getDirectionToNeighbor(Hex.neighbors("<0,0,0>"));

  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:my-source/1000",
  });
  const system: System = new System(
    systemTileObj,
    { source: "my-source", packageId: "my-package-id" },
    { tile: 1000 }
  );

  let localDirToNeighbor: DirectionToNeighborHexType;
  localDirToNeighbor =
    SystemAdjacencyHyperlane._localNeighborsWithRotAndFlip(system);
  expect(localDirToNeighbor.n).toEqual(globalNeighbors.n);
  expect(localDirToNeighbor.nw).toEqual(globalNeighbors.nw);

  systemTileObj.setRotation([0, 60, 0]);
  localDirToNeighbor =
    SystemAdjacencyHyperlane._localNeighborsWithRotAndFlip(system);
  expect(localDirToNeighbor.n).toEqual(globalNeighbors.nw);
  expect(localDirToNeighbor.nw).toEqual(globalNeighbors.sw);

  systemTileObj.setRotation([0, 60, -180]);
  localDirToNeighbor =
    SystemAdjacencyHyperlane._localNeighborsWithRotAndFlip(system);
  expect(localDirToNeighbor.n).toEqual(globalNeighbors.ne);
  expect(localDirToNeighbor.nw).toEqual(globalNeighbors.n);

  systemTileObj.setRotation([0, 300, 0]);
  localDirToNeighbor =
    SystemAdjacencyHyperlane._localNeighborsWithRotAndFlip(system);
  expect(localDirToNeighbor.n).toEqual(globalNeighbors.ne);
  expect(localDirToNeighbor.nw).toEqual(globalNeighbors.n);

  systemTileObj.setRotation([0, 300, -180]);
  localDirToNeighbor =
    SystemAdjacencyHyperlane._localNeighborsWithRotAndFlip(system);
  expect(localDirToNeighbor.n).toEqual(globalNeighbors.nw);
  expect(localDirToNeighbor.nw).toEqual(globalNeighbors.sw);
});

it("addTags (get paths)", () => {
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

  // Add sw-ne hyperlane system (center).  All systems must be registered with
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

  // Register hyperlane nodes and links.
  new SystemAdjacencyHyperlane().addTags(hexToSystem, adjacency);

  // Verify adjacency is being used correctly.
  const paths: ReadonlyArray<AdjacencyPathType> = adjacency.get(
    "<0,-1,1>", // sw
    1
  );

  const simplePaths: Array<string> = paths.map(
    (path: AdjacencyPathType): string => {
      const nodes: Array<AdjacencyNodeType> =
        SystemAdjacency.simplifyPath(path);
      return nodes.join(" --- ");
    }
  );

  expect(simplePaths).toEqual([
    "<0,-1,1> --- <0,-1,1>|<-1,0,1> --- <-1,0,1>", // neighbor
    "<0,-1,1> --- <0,-1,1>|<0,0,0> --- <0,0,0>|<0,1,-1> --- <0,1,-1>", // hyperlane
    "<0,-1,1> --- <0,-1,1>|<1,-1,0> --- <1,-1,0>", // neighbor
  ]);
});

it("addTags (rotated hyperlane)", () => {
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

  expect(
    adjacency.hasLink({
      src: "<0,-1,1>|<0,0,0>",
      dst: "<0,0,0>|<0,1,-1>",
      distance: 0,
      isTransit: true,
    })
  );
});

it("addTags (multiple hyperlanes)", () => {
  const hexToSystem: Map<HexType, System> = new Map<HexType, System>();
  const adjacency: Adjacency = new Adjacency();

  // Add sw-ne hyperlane system.
  new MockGameObject({
    templateMetadata: "tile.system:pok/88",
  });
  const hyperlaneSystem: System | undefined = TI4.systemRegistry.getByPosition(
    new Vector(0, 0, 0)
  );
  if (hyperlaneSystem) {
    hexToSystem.set("<0,0,0>", hyperlaneSystem);
  }

  // Register hyperlane nodes and links.
  new SystemAdjacencyHyperlane().addTags(hexToSystem, adjacency);

  expect(
    adjacency.hasLink({
      src: "<0,-1,1>|<0,0,0>",
      dst: "<0,0,0>|<0,1,-1>",
      distance: 0,
      isTransit: true,
    })
  );
  expect(
    adjacency.hasLink({
      src: "<0,-1,1>|<0,0,0>",
      dst: "<0,0,0>|<1,0,-1>",
      distance: 0,
      isTransit: true,
    })
  );
});

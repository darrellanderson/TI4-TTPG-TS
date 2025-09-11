import { MockGameObject } from "ttpg-mock";
import {
  Adjacency,
  AdjacencyLinkType,
  AdjacencyPathType,
  HexType,
} from "ttpg-darrell";

import { System } from "../system/system";
import { SystemAdjacency } from "./system-adjacency";
import { SystemAdjacencyNeighbor } from "./system-adjacency-neighbor";

it("constructor", () => {
  new SystemAdjacencyNeighbor();
});

it("addTags", () => {
  new MockGameObject({
    position: globalThis.TI4.hex.toPosition("<0,0,0>"),
    templateMetadata: "tile.system:base/1",
  });
  new MockGameObject({
    position: globalThis.TI4.hex.toPosition("<1,0,-1>"),
    templateMetadata: "tile.system:base/2",
  });
  const hexToSystem: Map<HexType, System> = SystemAdjacency.getHexToSystem();
  expect(hexToSystem.get("<0,0,0>")?.getSystemTileNumber()).toBe(1);
  expect(hexToSystem.get("<1,0,-1>")?.getSystemTileNumber()).toBe(2);

  const adjacency: Adjacency = new Adjacency();
  new SystemAdjacencyNeighbor().addTags(hexToSystem, adjacency);

  expect(
    adjacency.hasLink({
      src: "<1,0,-1>|<0,0,0>",
      dst: "<0,0,0>",
      distance: 0.5,
      isTransit: false,
    })
  ).toBeTruthy();
  expect(
    adjacency.hasLink({
      src: "<0,0,0>",
      dst: "<0,0,0>|<1,0,-1>",
      distance: 0.5,
      isTransit: true,
    })
  ).toBeTruthy();

  // Verify adjacency is being used correctly.
  const paths: ReadonlyArray<AdjacencyPathType> = adjacency.get("<0,0,0>", 100);
  expect(paths).toEqual([
    {
      distance: 1,
      node: "<1,0,-1>",
      path: [
        {
          distance: 0.5,
          dst: "<0,0,0>|<1,0,-1>",
          isTransit: true,
          src: "<0,0,0>",
        },
        {
          distance: 0.5,
          dst: "<1,0,-1>",
          isTransit: false,
          src: "<0,0,0>|<1,0,-1>",
        },
      ],
    },
  ]);
});

it("hyperlanes are other systems' neighbors", () => {
  new MockGameObject({
    position: globalThis.TI4.hex.toPosition("<0,0,0>"),
    templateMetadata: "tile.system:base/1",
  });
  new MockGameObject({
    position: globalThis.TI4.hex.toPosition("<1,0,-1>"),
    templateMetadata: "tile.system:pok/83", // hyperlane
  });
  const hexToSystem: Map<HexType, System> = SystemAdjacency.getHexToSystem();
  expect(hexToSystem.get("<0,0,0>")?.getSystemTileNumber()).toBe(1);
  expect(hexToSystem.get("<1,0,-1>")?.getSystemTileNumber()).toBe(83);

  const adjacency: Adjacency = new Adjacency();
  new SystemAdjacencyNeighbor().addTags(hexToSystem, adjacency);

  expect(
    adjacency.hasLink({
      src: "<1,0,-1>|<0,0,0>",
      dst: "<0,0,0>",
      distance: 0.5,
      isTransit: false,
    })
  ).toBeTruthy();
  expect(
    adjacency.hasLink({
      src: "<0,0,0>",
      dst: "<0,0,0>|<1,0,-1>",
      distance: 0.5,
      isTransit: true,
    })
  ).toBeTruthy();
});

it("neighbors must share same system class", () => {
  const hexToSystem: Map<HexType, System> = SystemAdjacency.getHexToSystem();
  hexToSystem.set(
    "<0,0,0>",
    new System(
      new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
      { source: "my-source", packageId: "my-package-id" },
      { tile: 1000, class: "map" }
    )
  );
  hexToSystem.set(
    "<1,0,-1>",
    new System(
      new MockGameObject({ templateMetadata: "tile.system:my-source/1001" }),
      { source: "my-source", packageId: "my-package-id" },
      { tile: 1001, class: "alt" }
    )
  );

  const adjacency: Adjacency = new Adjacency();
  new SystemAdjacencyNeighbor().addTags(hexToSystem, adjacency);

  expect(
    adjacency.hasLink({
      src: "<1,0,-1>|<0,0,0>",
      dst: "<0,0,0>",
      distance: 0.5,
      isTransit: false,
    })
  ).toBeFalsy();
  expect(
    adjacency.hasLink({
      src: "<0,0,0>",
      dst: "<0,0,0>|<1,0,-1>",
      distance: 0.5,
      isTransit: true,
    })
  ).toBeFalsy();
});

it("off-map systems are not neighbors", () => {
  const hexToSystem: Map<HexType, System> = SystemAdjacency.getHexToSystem();
  hexToSystem.set(
    "<0,0,0>",
    new System(
      new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
      { source: "my-source", packageId: "my-package-id" },
      { tile: 1000, class: "off-map" }
    )
  );
  hexToSystem.set(
    "<1,0,-1>",
    new System(
      new MockGameObject({ templateMetadata: "tile.system:my-source/1001" }),
      { source: "my-source", packageId: "my-package-id" },
      { tile: 1001, class: "off-map" }
    )
  );

  const adjacency = new Adjacency();
  new SystemAdjacencyNeighbor().addTags(hexToSystem, adjacency);

  // "off-map" never direct neighbors.

  expect(
    adjacency.hasLink({
      src: "<1,0,-1>|<0,0,0>",
      dst: "<0,0,0>",
      distance: 0.5,
      isTransit: false,
    })
  ).toBeFalsy();
  expect(
    adjacency.hasLink({
      src: "<0,0,0>",
      dst: "<0,0,0>|<1,0,-1>",
      distance: 0.5,
      isTransit: true,
    })
  ).toBeFalsy();
});

it("removeTags", () => {
  const adjacency: Adjacency = new Adjacency();
  const link: AdjacencyLinkType = {
    src: "<0,0,0>",
    dst: "<1,0,-1>|<0,0,0>",
    distance: 1,
    isTransit: false,
  };
  adjacency.addLink(link);
  expect(adjacency.hasLink(link)).toBeTruthy();

  new MockGameObject({
    templateMetadata: "token:thunders-edge/empyrean.blockade",
    position: [1, 0, 0], // closer to <1,0,-1>
  });
  new SystemAdjacencyNeighbor().removeTags(adjacency);
  expect(adjacency.hasLink(link)).toBeFalsy();
});

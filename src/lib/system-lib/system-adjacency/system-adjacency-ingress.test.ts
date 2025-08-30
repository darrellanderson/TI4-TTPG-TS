import { Adjacency, HexType } from "ttpg-darrell";
import { SystemAdjacencyIngress } from "./system-adjacency-ingress";
import { System } from "../system/system";
import { MockGameObject } from "ttpg-mock";
import { SourceAndPackageIdSchemaType } from "../schema";

it("constructor", () => {
  const ingress = new SystemAdjacencyIngress();
  expect(ingress).toBeDefined();
});

it("addTags", () => {
  const ingress: SystemAdjacencyIngress = new SystemAdjacencyIngress();
  const hexToSystem: Map<HexType, System> = new Map();
  const adjacency: Adjacency = new Adjacency();

  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  hexToSystem.set(
    "<0,0,0>",
    new System(
      MockGameObject.simple("tile.system:my-source/1000"),
      sourceAndPackageId,
      {
        tile: 1000,
        ingress: true,
      }
    )
  );
  hexToSystem.set(
    "<1,0,-1>",
    new System(
      MockGameObject.simple("tile.system:my-source/1001"),
      sourceAndPackageId,
      {
        tile: 1001,
        ingress: true,
      }
    )
  );
  hexToSystem.set(
    "<2,0,-2>",
    new System(
      MockGameObject.simple("tile.system:my-source/1002"),
      sourceAndPackageId,
      {
        tile: 1002,
        egress: true,
      }
    )
  );
  hexToSystem.set(
    "<3,0,-3>",
    new System(
      MockGameObject.simple("tile.system:my-source/1003"),
      sourceAndPackageId,
      {
        tile: 1003,
        egress: true,
      }
    )
  );

  ingress.addTags(hexToSystem, adjacency);

  expect(
    adjacency.hasLink({
      src: "<0,0,0>",
      dst: "<1,0,-1>",
      distance: 1,
      isTransit: false,
    })
  ).toBe(false);
  expect(
    adjacency.hasLink({
      src: "<2,0,-2>",
      dst: "<3,0,-3>",
      distance: 1,
      isTransit: false,
    })
  ).toBe(false);

  expect(
    adjacency.hasLink({
      src: "<0,0,0>",
      dst: "<2,0,-2>",
      distance: 1,
      isTransit: false,
    })
  ).toBe(true);
  expect(
    adjacency.hasLink({
      src: "<0,0,0>",
      dst: "<3,0,-3>",
      distance: 1,
      isTransit: false,
    })
  ).toBe(true);

  expect(
    adjacency.hasLink({
      src: "<3,0,-3>",
      dst: "<1,0,-1>",
      distance: 1,
      isTransit: false,
    })
  ).toBe(true);
  expect(
    adjacency.hasLink({
      src: "<3,0,-3>",
      dst: "<0,0,0>",
      distance: 1,
      isTransit: false,
    })
  ).toBe(true);
});

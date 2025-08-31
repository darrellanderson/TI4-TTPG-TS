import { Adjacency, HexType } from "ttpg-darrell";
import { System } from "../system/system";
import { MockGameObject } from "ttpg-mock";
import { SourceAndPackageIdSchemaType } from "../schema";
import { SystemAdjacencyBreach } from "./system-adjacency-breach";

it("constructor", () => {
  const breach = new SystemAdjacencyBreach();
  expect(breach).toBeDefined();
});

it("addTags", () => {
  const breach: SystemAdjacencyBreach = new SystemAdjacencyBreach();
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
        isBreach: true,
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
        isBreach: true,
      }
    )
  );

  breach.addTags(hexToSystem, adjacency);

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
      src: "<1,0,-1>",
      dst: "<0,0,0>",
      distance: 1,
      isTransit: false,
    })
  ).toBe(false);
});

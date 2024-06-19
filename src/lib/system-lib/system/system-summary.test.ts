import { MockGameObject } from "ttpg-mock";
import { System } from "../system/system";
import { SystemSummary } from "./system-summary";

it("constructor", () => {
  const systems: Array<System> = [];
  const systemSummary: SystemSummary = new SystemSummary(systems);
});

it("getSummaryRaw", () => {
  const systems: Array<System> = [
    new System(
      new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
      { source: "my-source", packageId: "my-package-id" },
      {
        tile: 1000,
        wormholes: ["beta"],
        planets: [
          {
            name: "my-planet-1",
            nsidName: "my-nsid-name-1",
            influence: 1,
            resources: 2,
            isLegendary: true,
            techs: ["red", "blue"],
            traits: ["industrial", "cultural"],
          },
        ],
      }
    ),
    new System(
      new MockGameObject({ templateMetadata: "tile.system:my-source/1001" }),
      { source: "my-source", packageId: "my-package-id" },
      {
        tile: 1001,
        wormholes: ["alpha"],
        planets: [
          {
            name: "my-planet-2",
            nsidName: "my-nsid-name-2",
            influence: 20,
            resources: 10,
          },
        ],
      }
    ),
    new System(
      new MockGameObject({ templateMetadata: "tile.system:my-source/1002" }),
      { source: "my-source", packageId: "my-package-id" },
      {
        tile: 1002,
        planets: [
          {
            name: "my-planet-3",
            nsidName: "my-nsid-name-3",
            influence: 100,
            resources: 100,
          },
        ],
      }
    ),
  ];
  const systemSummary: SystemSummary = new SystemSummary(systems);
  const result = systemSummary.getSummaryRaw();
  expect(result).toEqual({
    influence: 121,
    optInfluence: 70,
    resources: 112,
    optResources: 52,
    legendary: "L",
    techs: "BR",
    traits: "CI",
    wormholes: "αβ",
  });
});

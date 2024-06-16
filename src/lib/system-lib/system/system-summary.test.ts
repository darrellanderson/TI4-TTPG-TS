import { MockGameObject } from "ttpg-mock";
import { System } from "./system";
import { SystemSummary } from "./system-summary";

it("constructor", () => {
  const systems: Array<System> = [];
  const systemSummary: SystemSummary = new SystemSummary(systems);
});

it("getSummaryRaw", () => {
  const systems: Array<System> = [
    new System(
      new MockGameObject(),
      { source: "my-source", packageId: "my-package-id" },
      {
        tile: 1,
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
      new MockGameObject(),
      { source: "my-source", packageId: "my-package-id" },
      {
        tile: 2,
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
      new MockGameObject(),
      { source: "my-source", packageId: "my-package-id" },
      {
        tile: 3,
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

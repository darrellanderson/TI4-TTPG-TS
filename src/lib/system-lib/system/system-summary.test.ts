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
        wormholes: ["beta", "alpha"],
        planets: [
          {
            name: "my-planet",
            nsidName: "my-nsid-name",
            influence: 1,
            resources: 2,
            isLegendary: true,
            techs: ["red", "blue"],
            traits: ["industrial", "cultural"],
          },
        ],
      }
    ),
  ];
  const systemSummary: SystemSummary = new SystemSummary(systems);
  const result = systemSummary.getSummaryRaw();
  expect(result).toEqual({
    influence: 1,
    optInfluence: 0,
    resources: 2,
    optResources: 2,
    legendary: "L",
    techs: "BR",
    traits: "CI",
    wormholes: "αβ",
  });
});

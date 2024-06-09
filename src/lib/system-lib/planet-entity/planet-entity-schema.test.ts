import { PlanetEntitySchema, PlanetEntityType } from "./planet-entity-schema";

it("parse (required only)", () => {
  const parsed: PlanetEntityType = PlanetEntitySchema.parse({
    name: "my-name",
  });
  expect(parsed).toEqual({
    name: "my-name",
  });
});

it("parse with optional", () => {
  const parsed: PlanetEntityType = PlanetEntitySchema.parse({
    name: "my-name",
    nsid: "my-nsid",
    position: {
      x: 1,
      y: 2,
    },
    radius: 5,
    influence: 3,
    resources: 4,
    traits: ["cultural"],
    techs: ["blue"],
    isLegendary: true,
    isDestroyPlanet: true,
    img: "my-img",
    imgPackageId: "my-img-package-id",
  });
  expect(parsed).toEqual({
    name: "my-name",
    nsid: "my-nsid",
    position: {
      x: 1,
      y: 2,
    },
    radius: 5,
    influence: 3,
    resources: 4,
    traits: ["cultural"],
    techs: ["blue"],
    isLegendary: true,
    isDestroyPlanet: true,
    img: "my-img",
    imgPackageId: "my-img-package-id",
  });
});

it("parse with omitted anomalies", () => {
  expect(() => {
    PlanetEntitySchema.parse({
      name: "my-name",
      anomalies: [],
    });
  }).toThrow();
});

it("parse with omitted wormholes", () => {
  expect(() => {
    PlanetEntitySchema.parse({
      name: "my-name",
      wormholes: [],
    });
  }).toThrow();
});

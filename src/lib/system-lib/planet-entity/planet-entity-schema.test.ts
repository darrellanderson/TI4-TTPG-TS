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
    influence: 3,
    resources: 4,
    traits: ["cultural"],
    techs: ["blue"],
    legendary: true,
    radius: 5,
    destroyPlanet: false,
  });
  expect(parsed).toEqual({
    name: "my-name",
    nsid: "my-nsid",
    position: {
      x: 1,
      y: 2,
    },
    influence: 3,
    resources: 4,
    traits: ["cultural"],
    techs: ["blue"],
    legendary: true,
    radius: 5,
    destroyPlanet: false,
  });
});

import { PlanetSchema, PlanetSchemaType } from "./planet-schema";

it("PlanetSchema", () => {
  const params: PlanetSchemaType = {
    name: "my-name",
    localPosition: { x: 1, y: 2 },
    radius: 3,
    influence: 4,
    resources: 5,
    techs: [],
    traits: [],
    isLegendary: true,
    legendaryCardNsid: "my-legendary-card-nsid",
  };
  const planetSchema = PlanetSchema.parse(params);
  expect(planetSchema).toEqual(params);
});

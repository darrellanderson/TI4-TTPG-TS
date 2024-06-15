import { PlanetAttachmentSchema } from "./planet-attachment-schema";

it("PlanetAttachmentSchema", () => {
  const data = {
    name: "my-name",
    nsidName: "my-nsid-name",
    imgFaceDown: true,
    influence: 1,
    resources: 2,
    techs: ["red", "blue"],
    traits: ["cultural", "industrial"],
    isLegendary: true,
    legendaryNsidName: "legendary-nsid-name",
    isDestroyPlanet: true,
  };
  const parsed = PlanetAttachmentSchema.parse(data);
  expect(parsed).toEqual(data);
});

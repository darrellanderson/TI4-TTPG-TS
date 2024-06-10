import { PlanetAttachmentSchema } from "./planet-attachment-schema";

it("PlanetAttachmentSchema", () => {
  const data = {
    name: "my-name",
    nsid: "my-nsid",
    img: "my-img",
    imgPackageId: "my-img-package-id",
    influence: 1,
    resources: 2,
    techs: ["red", "blue"],
    traits: ["cultural", "industrial"],
    isLegendary: true,
    legendaryCardNsid: "legendary-card-nsid",
    isDestroyPlanet: true,
  };
  const parsed = PlanetAttachmentSchema.parse(data);
  expect(parsed).toEqual(data);
});

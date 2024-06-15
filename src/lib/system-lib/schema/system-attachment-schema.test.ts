import { SystemAttachmentSchema } from "./system-attachment-schema";

it("SystemAttachmentSchema", () => {
  const data = {
    name: "my-name",
    nsidName: "my-nsid-name",
    anomalies: ["gravity-rift", "asteroid-field"],
    wormholes: ["alpha", "beta"],
    wormholesFaceDown: ["gamma"],
    planets: [],
    img: "my-img",
    imgPackageId: "my-img-package-id",
  };
  const parsed = SystemAttachmentSchema.parse(data);
  expect(parsed).toEqual(data);
});

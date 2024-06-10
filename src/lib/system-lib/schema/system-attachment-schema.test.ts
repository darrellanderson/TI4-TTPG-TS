import { SystemAttachmentSchema } from "./system-attachment-schema";

it("SystemAttachmentSchema", () => {
  const data = {
    name: "my-name",
    nsid: "my-nsid",
    anomalies: ["gravity_rift", "asteroid_field"],
    wormholes: ["alpha", "beta"],
    wormholesFaceDown: ["gamma"],
    planets: [],
    img: "my-img",
    imgPackageId: "my-img-package-id",
  };
  const parsed = SystemAttachmentSchema.parse(data);
  expect(parsed).toEqual(data);
});

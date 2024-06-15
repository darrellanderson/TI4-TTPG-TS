import { SystemAttachmentSchema } from "./system-attachment-schema";

it("SystemAttachmentSchema", () => {
  const data = {
    name: "my-name",
    nsidName: "my-nsid-name",
    anomalies: ["gravity-rift", "asteroid-field"],
    wormholes: ["alpha", "beta"],
    wormholesFaceDown: ["gamma"],
    planets: [],
    imgFaceDown: true,
  };
  const parsed = SystemAttachmentSchema.parse(data);
  expect(parsed).toEqual(data);
});

import { SystemSchema, SystemSchemaType } from "./system-schema";

it("SystemSchema", () => {
  const data: SystemSchemaType = {
    tile: 1,
    isHome: true,
    isHyperlane: true,
    anomalies: ["asteroid-field", "gravity-rift"],
    wormholes: ["alpha", "beta"],
    imgFaceDown: true,
  };
  const parsed = SystemSchema.parse(data);
  expect(parsed).toEqual(data);
});

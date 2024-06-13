import { SystemSchema, SystemSchemaType } from "./system-schema";

it("SystemSchema", () => {
  const data: SystemSchemaType = {
    tile: 1,
    isHome: true,
    isHyperlane: true,
    anomalies: ["asteroid_field", "gravity_rift"],
    wormholes: ["alpha", "beta"],
    imgFaceDown: true,
    imgPackageId: "my-img-package-id",
  };
  const parsed = SystemSchema.parse(data);
  expect(parsed).toEqual(data);
});

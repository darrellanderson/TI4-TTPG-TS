import { SystemSchema, SystemSchemaType } from "./system-schema";

it("SystemSchema", () => {
  const data: SystemSchemaType = {
    tile: 1,
    source: "my-source",
    isHome: true,
    isHyperlane: true,
    anomalies: ["asteroid_field", "gravity_rift"],
    wormholes: ["alpha", "beta"],
    img: "my-img",
    imgPackageId: "my-img-package-id",
  };
  const parsed = SystemSchema.parse(data);
  expect(parsed).toEqual(data);
});

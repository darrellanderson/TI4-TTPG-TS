import { SystemSchema, SystemSchemaType } from "./system-schema";

it("constructor", () => {
  const parsed: SystemSchemaType = SystemSchema.parse({
    name: "my-name",
    tile: 1,
    img: "my-img",
    imgPackageId: "my-imgPackageId",
  });
  expect(parsed).toEqual({
    class: "map",
    img: "my-img",
    imgPackageId: "my-imgPackageId",
    name: "my-name",
    tile: 1,
  });
});

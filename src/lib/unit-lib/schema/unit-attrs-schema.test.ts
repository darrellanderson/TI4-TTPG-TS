import { UnitAttrsSchema, UnitAttrsSchemaType } from "./unit-attrs-schema";

it("parse", () => {
  const input: UnitAttrsSchemaType = {
    name: "my-name",
    unit: "infantry",
  };
  const parsed = UnitAttrsSchema.parse(input);
  expect(parsed).toEqual(input);
});

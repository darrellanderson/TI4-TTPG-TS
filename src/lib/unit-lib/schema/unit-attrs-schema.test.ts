import { UnitAttrsSchema, UnitAttrsType } from "./unit-attrs-schema";

it("unit schema", () => {
  const input: UnitAttrsType = {
    name: "my-name",
    unit: "infantry",
  };
  const parsed = UnitAttrsSchema.parse(input);
  expect(parsed).toEqual(input);
});

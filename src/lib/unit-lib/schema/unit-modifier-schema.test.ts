import {
  UnitModifierSchema,
  UnitModifierSchemaType,
} from "./unit-modifier-schema";

it("parse", () => {
  const params: UnitModifierSchemaType = {
    name: "name",
    description: "description",
    owner: "self",
    priority: "mutate",
  };
  const parsed = UnitModifierSchema.parse(params);
  expect(parsed).toEqual(params);
});

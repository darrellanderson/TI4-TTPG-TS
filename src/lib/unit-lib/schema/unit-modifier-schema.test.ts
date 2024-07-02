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
    triggers: [
      {
        cardClass: "technology",
        nsidName: "my-nsid-name",
      },
    ],
    applies: (x: string): boolean => {
      return true;
    },
    apply: (x: number): void => {},
  };
  const parsed = UnitModifierSchema.parse(params);
  expect(parsed).toBeDefined(); // toEqual fails for function values, just check exists
});

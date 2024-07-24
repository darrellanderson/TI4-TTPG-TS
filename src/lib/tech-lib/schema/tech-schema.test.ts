import { TechSchema, TechSchemaType } from "./tech-schema";

it("parse", () => {
  const tech: TechSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    color: "blue",
    prerequisites: { green: 1, red: 2 },
  };

  const parsed: TechSchemaType = TechSchema.parse(tech);
  expect(parsed).toEqual(tech);
});

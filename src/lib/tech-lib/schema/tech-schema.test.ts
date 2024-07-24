import { TechSchema, TechSchemaType } from "./tech-schema";

it("parse", () => {
  const tech: TechSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    color: "blue",
    prerequisites: [
      { color: "green", count: 1 },
      { color: "red", count: 2 },
    ],
  };

  const parsed: TechSchemaType = TechSchema.parse(tech);
  expect(parsed).toEqual(tech);
});

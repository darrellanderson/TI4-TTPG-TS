import { TechSchemaType } from "../schema/tech-schema";
import { Tech } from "./tech";

it("tech", () => {
  const schema: TechSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    color: "blue",
    prerequisites: {
      green: 1,
      red: 2,
    },
  };
  const tech: Tech = new Tech("my-source", schema);
  expect(tech.getNsid()).toEqual("card.technology.blue:my-source/my-nsid-name");
  expect(tech.isFactionTech()).toBe(false);
});

import { TechSchemaType } from "../schema/tech-schema";
import { Tech } from "./tech";

it("static sortByLevel", () => {
  const schema1: TechSchemaType = {
    nsidName: "my-nsid-name",
    name: "level3",
    color: "blue",
    prerequisites: {
      blue: 1,
      green: 2,
    },
  };
  const tech1: Tech = new Tech("my-source", schema1);

  const schema2: TechSchemaType = {
    nsidName: "my-nsid-name",
    name: "level2",
    color: "blue",
    prerequisites: {
      red: 2,
    },
  };
  const tech2: Tech = new Tech("my-source", schema2);

  const schema3: TechSchemaType = {
    nsidName: "my-nsid-name",
    name: "level2-alt",
    color: "blue",
    prerequisites: {
      yellow: 2,
    },
  };
  const tech3: Tech = new Tech("my-source", schema3);

  expect(
    Tech.sortByLevel([tech1, tech2, tech3]).map((tech) => tech.getName())
  ).toEqual(["level2", "level2-alt", "level3"]);

  expect(
    Tech.sortByLevel([tech2, tech3, tech1]).map((tech) => tech.getName())
  ).toEqual(["level2", "level2-alt", "level3"]);

  expect(
    Tech.sortByLevel([tech3, tech1, tech2]).map((tech) => tech.getName())
  ).toEqual(["level2", "level2-alt", "level3"]);
});

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

it("getColor", () => {
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
  expect(tech.getColor()).toEqual("blue");
});

it("getLevel", () => {
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
  expect(tech.getLevel()).toEqual(3);

  const schema2: TechSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    color: "blue",
    prerequisites: {
      blue: 1,
      yellow: 2,
    },
  };
  const tech2: Tech = new Tech("my-source", schema2);
  expect(tech2.getLevel()).toEqual(3);
});

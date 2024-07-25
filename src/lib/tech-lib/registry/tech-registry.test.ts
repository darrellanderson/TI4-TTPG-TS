import { TechSchemaType } from "../schema/tech-schema";
import { Tech } from "../tech/tech";
import { TechRegistry } from "./tech-registry";

it("constructor", () => {
  new TechRegistry();
});

it("load (empty)", () => {
  const registry = new TechRegistry();
  registry.load("source", []);
});

it("load (with data)", () => {
  const schema: TechSchemaType = {
    name: "my-name",
    nsidName: "my-nsid-name",
    color: "blue",
    prerequisites: {
      green: 1,
      red: 2,
    },
  };

  const registry = new TechRegistry();
  let raw: TechSchemaType | undefined;
  let tech: Tech | undefined;

  raw = registry.rawByNsidName("my-nsid-name");
  tech = registry.getByNsid("card.technology.blue:my-source/my-nsid-name");
  expect(raw).toBeUndefined();
  expect(tech).toBeUndefined();

  registry.load("my-source", [schema]);

  raw = registry.rawByNsidName("my-nsid-name");
  tech = registry.getByNsid("card.technology.blue:my-source/my-nsid-name");
  expect(raw?.nsidName).toBe("my-nsid-name");
  expect(tech?.getName()).toBe("my-name");
});

it("load (invalid schema)", () => {
  const registry = new TechRegistry();
  expect(() => {
    registry.load("source", [
      {
        name: "my-name",
        nsidName: "@@invalid!!",
        color: "blue",
        prerequisites: {
          green: 1,
          red: 2,
        },
      },
    ]);
  }).toThrow();
});

it("load (duplicate)", () => {
  const schema: TechSchemaType = {
    name: "my-name",
    nsidName: "my-nsid-name",
    color: "blue",
    prerequisites: {
      green: 1,
      red: 2,
    },
  };

  const registry = new TechRegistry();
  registry.load("source", [schema]); // first time
  expect(() => {
    registry.load("source", [schema]); // duplicate
  }).toThrow();
});

it("loadDefaultData", () => {
  const registry = new TechRegistry();
  let raw: TechSchemaType | undefined;
  let tech: Tech | undefined;

  raw = registry.rawByNsidName("plasma-scoring");
  tech = registry.getByNsid("card.technology.red:base/plasma-scoring");
  expect(raw).toBeUndefined();
  expect(tech).toBeUndefined();

  registry.loadDefaultData();

  raw = registry.rawByNsidName("plasma-scoring");
  tech = registry.getByNsid("card.technology.red:base/plasma-scoring");
  expect(raw?.nsidName).toBe("plasma-scoring");
  expect(tech?.getName()).toBe("Plasma Scoring");
});

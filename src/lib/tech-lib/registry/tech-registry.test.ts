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
  expect(registry.getByNsidName("my-nsid-name")).toBeUndefined();

  registry.load("my-source", [schema]);
  expect(registry.getByNsidName("my-nsid-name")?.getNsidName()).toBe(
    "my-nsid-name"
  );
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
  expect(registry.getByNsidName("plasma-scoring")).toBeUndefined();

  registry.loadDefaultData();
  expect(registry.getByNsidName("plasma-scoring")).toBeDefined();
});

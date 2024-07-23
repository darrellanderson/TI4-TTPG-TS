import { FactionSchemaType } from "../schema/faction-schema";
import { FactionRegistry } from "./faction-registry";

it("constructor", () => {
  new FactionRegistry();
});

it("load (empty)", () => {
  const registry = new FactionRegistry();
  registry.load("source", []);
});

it("load (with data)", () => {
  const schema: FactionSchemaType = {
    name: "my-name",
    nsidName: "my-nsid-name",
    abbr: "my-abbr",
    abilities: [],
    commodities: 0,
    home: 0,
    leaders: {
      agents: [],
      commanders: [],
      heroes: [],
      mechs: [],
    },
    promissoryNotes: [],
    startingTechs: [],
    startingUnits: {},
    techs: ["one", "two"],
    unitOverrides: [],
  };

  const registry = new FactionRegistry();
  expect(registry.rawByNsidName("my-nsid-name")).toBeUndefined();

  registry.load("my-source", [schema]);
  expect(registry.rawByNsidName("my-nsid-name")?.name).toBe("my-name");
});

it("load (invalid schema)", () => {
  const registry = new FactionRegistry();
  expect(() => {
    registry.load("source", [
      {
        nsidName: "@@invalid!!",
        name: "my-name",
        abbr: "my-abbr",
        abilities: [],
        commodities: 0,
        home: 0,
        leaders: {
          agents: [],
          commanders: [],
          heroes: [],
          mechs: [],
        },
        promissoryNotes: [],
        startingTechs: [],
        startingUnits: {},
        techs: [],
        unitOverrides: [],
        extras: [{ nsid: "extra-nsid", count: 0 }],
      },
    ]);
  }).toThrow();
});

it("loadDefaultData", () => {
  const registry = new FactionRegistry();
  expect(registry.rawByNsidName("arborec")).toBeUndefined();
  expect(registry.getAllFactions()).toHaveLength(0);

  registry.loadDefaultData();
  expect(registry.rawByNsidName("arborec")).toBeDefined();
  expect(registry.getAllFactions()).not.toHaveLength(0);
});

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
    promissories: [],
    startingTechs: [],
    startingUnits: {},
    factionTechs: ["one", "two"],
    unitOverrides: [],
  };

  const registry = new FactionRegistry();
  expect(registry.getByNsid("faction:my-source/my-nsid-name")).toBeUndefined();

  registry.load("my-source", [schema]);
  expect(registry.getByNsid("faction:my-source/my-nsid-name")?.getName()).toBe(
    "my-name"
  );
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
        promissories: [],
        startingTechs: [],
        startingUnits: {},
        factionTechs: [],
        unitOverrides: [],
        extras: [{ nsid: "extra-nsid", count: 0 }],
      },
    ]);
  }).toThrow();
});

it("loadDefaultData", () => {
  const registry = new FactionRegistry();
  expect(registry.getByNsid("faction:base/arborec")).toBeUndefined();
  expect(registry.getAllFactions()).toHaveLength(0);

  registry.loadDefaultData();
  expect(registry.getByNsid("faction:base/arborec")).toBeDefined();
  expect(registry.getAllFactions()).not.toHaveLength(0);
});

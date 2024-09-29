import { MockCardHolder, MockGameObject } from "ttpg-mock";

import { Faction } from "../faction/faction";
import { FactionRegistry } from "./faction-registry";
import { FactionSchemaType } from "../schema/faction-schema";
import { SourceAndPackageIdSchemaType } from "../../system-lib/schema/basic-types-schema";

it("constructor", () => {
  new FactionRegistry();
});

it("getPlayerSlotToFaction", () => {
  new MockCardHolder({ position: [10, 0, 0], owningPlayerSlot: 1 });
  new MockCardHolder({ position: [20, 0, 0], owningPlayerSlot: 2 });
  new MockGameObject({
    position: [10, 0, 0],
    templateMetadata: "sheet.faction:base/arborec",
  });
  new MockGameObject({
    position: [20, 0, 0],
    templateMetadata: "sheet.faction:pok/argent",
  });

  const registry: FactionRegistry = new FactionRegistry().loadDefaultData();
  const playerSlotToFaction: Map<number, Faction> =
    registry.getPlayerSlotToFaction();

  expect(playerSlotToFaction.get(1)?.getName()).toBe("The Arborec");
  expect(playerSlotToFaction.get(2)?.getName()).toBe("The Argent Flight");
});

it("load (empty)", () => {
  const registry = new FactionRegistry();
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  registry.load(sourceAndPackageId, []);
});

it("load (with data)", () => {
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
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

  registry.load(sourceAndPackageId, [schema]);
  expect(registry.getByNsid("faction:my-source/my-nsid-name")?.getName()).toBe(
    "my-name",
  );
});

it("load (invalid schema)", () => {
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  const registry = new FactionRegistry();
  expect(() => {
    registry.load(sourceAndPackageId, [
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

it("validate (global)", () => {
  TI4.factionRegistry.validateOrThrow();
});

it("validate (missing faction tech)", () => {
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  const registry = new FactionRegistry().load(sourceAndPackageId, [
    {
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
      startingTechs: ["__missing__"],
      startingUnits: {},
      factionTechs: ["plasma-scoring", "antimass-deflectors"],
      unitOverrides: [],
    },
  ]);
  expect(() => {
    registry.validateOrThrow();
  }).toThrow();
});

it("validate (missing starting tech)", () => {
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  const registry = new FactionRegistry().load(sourceAndPackageId, [
    {
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
      factionTechs: ["plasma-scoring", "__missing__"],
      unitOverrides: [],
    },
  ]);
  expect(() => {
    registry.validateOrThrow();
  }).toThrow();
});

it("validate (missing unit override)", () => {
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  const registry = new FactionRegistry().load(sourceAndPackageId, [
    {
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
      factionTechs: ["plasma-scoring", "antimass-deflectors"],
      unitOverrides: ["__missing__"],
    },
  ]);
  expect(() => {
    registry.validateOrThrow();
  }).toThrow();
});

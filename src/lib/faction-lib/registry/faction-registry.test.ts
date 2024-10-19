// klawSync needs process.{env,version} to be defined.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).env = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).version = "0";

import fs from "fs";
import klawSync from "klaw-sync";

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

  expect(registry.getByPlayerSlot(1)?.getName()).toBe("The Arborec");
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
    "my-name"
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

it("validate NSIDs appear in assets/Templates", () => {
  // Scan templates for NSIDs.
  const templateNsids: Set<string> = new Set();
  const entries: readonly klawSync.Item[] = klawSync("assets/Templates/", {
    nodir: true,
    traverseAll: true,
    filter: (item) => {
      return item.path.endsWith(".json");
    },
  });
  const regex: RegExp =
    /"(sheet.faction:.*|token.command:.*|token.control:.*|card.leader.*|card.alliance.*|card.technology.*)"/;
  for (const entry of entries) {
    const data: Buffer = fs.readFileSync(entry.path);
    const lines: Array<string> = data.toString().split("\n");
    for (const line of lines) {
      const match: RegExpMatchArray | null = line.match(regex);
      const nsid: string | undefined = match?.[1];
      if (nsid) {
        templateNsids.add(nsid);
      }
    }
  }

  const nsids: Array<string> = [];
  const factions: Array<Faction> = new FactionRegistry()
    .loadDefaultData()
    .getAllFactions();
  for (const faction of factions) {
    nsids.push(faction.getFactionSheetNsid());
    nsids.push(faction.getControlTokenNsid());
    nsids.push(faction.getCommandTokenNsid());
    nsids.push(faction.getAllianceNsid());
    nsids.push(...faction.getAgentNsids());
    nsids.push(...faction.getCommanderNsids());
    nsids.push(...faction.getHeroNsids());
    nsids.push(...faction.getMechNsids());

    // Tech does not include tech color/type.
    for (const nsidName of faction.getFactionTechNsidNames()) {
      let found: boolean = false;
      for (const nsid of TI4.techRegistry.getAllNsids()) {
        if (nsid.endsWith(nsidName)) {
          nsids.push(nsid);
          found = true;
          break;
        }
      }
      if (!found) {
        throw new Error(`Missing tech: ${nsidName}`);
      }
    }
  }

  const missing: Array<string> = [];
  for (const nsid of nsids) {
    if (!templateNsids.has(nsid) && !templateNsids.has(nsid + ".1")) {
      missing.push(nsid);
    }
  }
  if (missing.length > 0) {
    console.log("missing", missing.join("\n"));
  }
  expect(missing).toHaveLength(0);
});

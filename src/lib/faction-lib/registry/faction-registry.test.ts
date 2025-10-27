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
import { UnitSchema } from "../../unit-lib/schema/unit-attrs-schema";

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
    home: 10,
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
  expect(registry.getByHomeSystemTileNumber(10)?.getName()).toBeUndefined();

  registry.load(sourceAndPackageId, [schema]);
  expect(registry.getByNsid("faction:my-source/my-nsid-name")?.getName()).toBe(
    "my-name"
  );
  expect(registry.getByHomeSystemTileNumber(10)?.getName()).toBe("my-name");

  expect(registry.getByNsidNameOrThrow("my-nsid-name")).toBeDefined();
  expect(() => {
    registry.getByNsidNameOrThrow("__invalid__");
  }).toThrow();
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
  expect(() => {
    registry.getByNsidOrThrow("faction:base/arborec");
  }).toThrow();
  expect(registry.getAllFactions()).toHaveLength(0);

  registry.loadDefaultData();
  expect(registry.getByNsid("faction:base/arborec")).toBeDefined();
  expect(registry.getByNsidOrThrow("faction:base/arborec")).toBeDefined();
  expect(
    registry.getByNsidOrThrow("faction:codex.vigil/keleres-argent")
  ).toBeDefined();
  expect(registry.getAllFactions()).not.toHaveLength(0);
});

it("rewriteLeader", () => {
  const registry = new FactionRegistry().loadDefaultRewriteNsid();

  let orig: string;
  let rewritten: string;

  orig = "card.leader.agent:pok/zeu";
  rewritten = registry.rewriteNsid(orig);
  expect(rewritten).toBe(orig);

  orig = "card.leader.agent:pok/zeu.omega";
  rewritten = registry.rewriteNsid(orig);
  expect(rewritten).toBe("card.leader.agent:codex.vigil/zeu.omega");
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

it("validate starting units are UnitType", () => {
  const factions: Array<Faction> = new FactionRegistry()
    .loadDefaultData()
    .getAllFactions();
  for (const faction of factions) {
    for (const unitType of Object.keys(faction.getStartingUnits())) {
      expect(typeof unitType).toBe("string");
      UnitSchema.parse(unitType);
    }
  }
});

it("validate NSIDs appear in assets/Templates", () => {
  // Scan templates for NSIDs.
  const templateNsids: Set<string> = new Set(TI4.spawn.getAllNsids());
  const entries: readonly klawSync.Item[] = klawSync("assets/Templates/", {
    nodir: true,
    traverseAll: true,
    filter: (item) => {
      return item.path.endsWith(".json");
    },
  });
  const regex: RegExp = /"(card.*|sheet.faction:.*|tile.system:.*|token.*)"/;
  for (const entry of entries) {
    const data: Buffer = fs.readFileSync(entry.path);
    const lines: Array<string> = data.toString().split("\n");
    for (const line of lines) {
      const match: RegExpMatchArray | null = line.match(regex);
      const nsid: string | undefined = match?.[1];
      if (nsid) {
        const parts: Array<string> = nsid.split("|");
        const first: string | undefined = parts[0];
        if (first) {
          templateNsids.add(first);
        }
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
    nsids.push(...faction.getAllianceNsids());
    nsids.push(...faction.getAgentNsids());
    nsids.push(...faction.getCommanderNsids());
    nsids.push(...faction.getHeroNsids());
    nsids.push(...faction.getMechNsids());
    nsids.push(...faction.getExtras());

    // Tech does not include tech color/type.
    for (const nsid of faction.getFactionTechNsids()) {
      if (!TI4.techRegistry.getByNsid(nsid)) {
        throw new Error(`Missing tech: ${nsid}`);
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

it("getAllFactionsFilteredByConfigSources", () => {
  const registry: FactionRegistry = new FactionRegistry().loadDefaultData();
  let factions: Array<Faction>;

  TI4.config.setSources(["base", "pok"]);
  factions = registry.getAllFactionsFilteredByConfigSources();
  expect(factions).toHaveLength(24); // keleres flavors are separate

  TI4.config.setSources(["base", "pok", "codex.vigil"]);
  factions = registry.getAllFactionsFilteredByConfigSources();
  expect(factions).toHaveLength(27); // keleres flavors are separate

  TI4.config.setSources(["base"]);
  factions = registry.getAllFactionsFilteredByConfigSources();
  expect(factions).toHaveLength(17);
});

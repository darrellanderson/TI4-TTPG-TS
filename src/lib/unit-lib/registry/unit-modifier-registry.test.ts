// klawSync needs process.{env,version} to be defined.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).env = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).version = "0";

import fs from "fs";
import klawSync from "klaw-sync";

import { CombatRoll } from "../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../schema/unit-modifier-schema";
import { UnitModifierRegistry } from "./unit-modifier-registry";

it("constructor", () => {
  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  expect(registry).toBeInstanceOf(UnitModifierRegistry);
});

it("getAllWithNsids", () => {
  const source: string = "my-source";
  const schema: UnitModifierSchemaType = {
    name: "my-name",
    description: "my-description",
    owner: "self",
    priority: "mutate",
    triggers: [
      {
        cardClass: "action",
        nsidName: "my-nsid-name",
      },
    ],
    applies: (_x: CombatRoll): boolean => {
      return true;
    },
    apply: (_x: CombatRoll): void => {},
  };

  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  expect(registry.getAllWithNsids().length).toBe(0);

  registry.load(source, [schema]);
  expect(registry.getAllWithNsids().length).toBe(1);
});

it("getAlways", () => {
  const source: string = "my-source";
  const schema: UnitModifierSchemaType = {
    name: "my-name",
    description: "my-description",
    owner: "self",
    priority: "mutate",
    triggerAlways: true,
    triggers: [],
    applies: (_x: CombatRoll): boolean => {
      return true;
    },
    apply: (_x: CombatRoll): void => {},
  };

  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  expect(registry.getAllWithNsids().length).toBe(0);

  registry.load(source, [schema]);
  expect(registry.getAlways().length).toBe(1);
});

it("getByNsid", () => {
  const source: string = "my-source";
  const schema: UnitModifierSchemaType = {
    name: "my-name",
    description: "my-description",
    owner: "self",
    priority: "mutate",
    triggers: [
      {
        cardClass: "action",
        nsidName: "my-nsid-name",
      },
    ],
    applies: (_x: CombatRoll): boolean => {
      return true;
    },
    apply: (_x: CombatRoll): void => {},
  };
  const nsid: string = "card.action:my-source/my-nsid-name";

  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  expect(registry.getByNsid(nsid)).toBeUndefined();

  registry.load(source, [schema]);
  expect(registry.getByNsid(nsid)).toBeDefined();
  expect(registry.getByNsid(nsid)?.getName()).toBe("my-name");
});

it("load", () => {
  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  expect(
    registry.load("source", [
      {
        name: "my-name",
        description: "my-description",
        owner: "self",
        priority: "mutate",
        triggers: [],
        applies: (_x: CombatRoll): boolean => {
          return true;
        },
        apply: (_x: CombatRoll): void => {},
      },
    ])
  ).toBeInstanceOf(UnitModifierRegistry);
});

it("loadDefaultData", () => {
  const registry: UnitModifierRegistry = new UnitModifierRegistry();
  registry.loadDefaultData();
});

it("validate (global)", () => {
  TI4.unitModifierRegistry.validateOrThrow();
});

it("validate (missing tech)", () => {
  const registry: UnitModifierRegistry = new UnitModifierRegistry().load(
    "source",
    [
      {
        name: "my-name",
        description: "my-description",
        triggers: [{ cardClass: "technology.red", nsidName: "my-nsid-name-2" }],
        owner: "self",
        priority: "mutate",
        applies: (_x: CombatRoll): boolean => {
          return true;
        },
        apply: (_x: CombatRoll): void => {},
      },
    ]
  );
  expect(() => {
    registry.validateOrThrow();
  }).toThrow();
});

it("validate (missing unit)", () => {
  const registry: UnitModifierRegistry = new UnitModifierRegistry().load(
    "source",
    [
      {
        name: "my-name",
        description: "my-description",
        triggers: [{ cardClass: "unit", nsidName: "my-nsid-name-2" }],
        owner: "self",
        priority: "mutate",
        applies: (_x: CombatRoll): boolean => {
          return true;
        },
        apply: (_x: CombatRoll): void => {},
      },
    ]
  );
  expect(() => {
    registry.validateOrThrow();
  }).toThrow();
});

it("validate NSIDs appear in assets/Templates", () => {
  // Scan templates for NSIDs.
  const templateNsids: Set<string> = new Set();
  const entries: readonly klawSync.Item[] = klawSync("assets/Templates/card/", {
    nodir: true,
    traverseAll: true,
    filter: (item) => {
      return item.path.endsWith(".json");
    },
  });
  const regex: RegExp = /"(card.*)"/;
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
  const nsids: Array<string> = new UnitModifierRegistry()
    .loadDefaultData()
    .getAllNsids()
    .filter((nsid) => nsid.startsWith("card."));
  let missing: Array<string> = [];
  for (const nsid of nsids) {
    if (!templateNsids.has(nsid) && !templateNsids.has(nsid + ".1")) {
      missing.push(nsid);
    }
  }

  missing = missing.filter((nsid) => {
    // Ignore test source.
    if (nsid.includes(":test/")) {
      return false;
    }
    // TODO XXX REMOVE WHEN LAUNCHED
    if (nsid.includes(":thunders-edge/")) {
      return false;
    }
    return true;
  });

  if (missing.length > 0) {
    console.log("missing", missing.join("\n"));
  }
  expect(missing).toHaveLength(0);
});

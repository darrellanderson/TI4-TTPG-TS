// klawSync needs process.{env,version} to be defined.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).env = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).version = "0";

import fs from "fs";
import klawSync from "klaw-sync";

import { UnitAttrsRegistry } from "./unit-attrs-registry";

it("constructor", () => {
  new UnitAttrsRegistry();
});

it("load (empty)", () => {
  const registry = new UnitAttrsRegistry();
  registry.load("source", []);
});

it("load (with data)", () => {
  const nsid = "card.technology.unit-upgrade:my-source/my-nsid-name-2";

  const registry = new UnitAttrsRegistry();
  expect(registry.rawByUnit("infantry")).toBeUndefined();
  expect(registry.rawByNsid(nsid)).toBeUndefined();

  registry.load("my-source", [
    {
      name: "my-base-name",
      unit: "infantry",
    },
    {
      name: "my-override-name",
      unit: "infantry",
      nsidName: "my-nsid-name-2",
    },
  ]);
  expect(registry.rawByUnit("infantry")?.name).toBe("my-base-name");
  expect(registry.rawByNsid(nsid)?.name).toBe("my-override-name");
});

it("load (invalid schema)", () => {
  const registry = new UnitAttrsRegistry();
  expect(() => {
    registry.load("source", [
      {
        name: "my-base-name",
        unit: "infantry",
        nsidName: "@@invalid",
      },
    ]);
  }).toThrow();
});

it("loadDefaultData", () => {
  const nsid1 = "unit:base/hybrid-crystal-fighter";
  const nsid2 = "card.technology.unit-upgrade:base/hybrid-crystal-fighter-2";

  const registry = new UnitAttrsRegistry();
  expect(registry.rawByUnit("fighter")).toBeUndefined();
  expect(registry.rawByNsid(nsid1)).toBeUndefined();
  expect(registry.rawByNsid(nsid2)).toBeUndefined();
  expect(registry.getAllBaseAttrs()).toHaveLength(0);
  expect(registry.rawByUnit("mech")).toBeUndefined();

  registry.loadDefaultData();
  expect(registry.rawByNsid(nsid1)).toBeDefined();
  expect(registry.rawByNsid(nsid2)).toBeDefined();
  expect(registry.getAllBaseAttrs()).not.toHaveLength(0);
  expect(registry.rawByUnit("mech")).toBeDefined();
});

it("loadDefaultData (twilights fall)", () => {
  const nsid: string = "card.tf-unit-upgrade:twilights-fall/university-war-sun";

  const registry = new UnitAttrsRegistry();
  registry.loadDefaultData();
  expect(registry.rawByNsid(nsid)).toBeDefined();
});

it("validate (global)", () => {
  TI4.unitAttrsRegistry.validateOrThrow();
});

it("validate (missing tech)", () => {
  const registry: UnitAttrsRegistry = new UnitAttrsRegistry().load("source", [
    {
      name: "my-name",
      unit: "infantry",
      nsidName: "my-nsid-name-2",
    },
  ]);
  expect(() => {
    registry.validateOrThrow();
  }).toThrow();
});

it("war sun", () => {
  const registry: UnitAttrsRegistry = new UnitAttrsRegistry().loadDefaultData();
  expect(
    registry.rawByNsid("card.technology.unit-upgrade:base/war-sun-2")?.unit
  ).toBe("war-sun");
});

it("validate NSIDs appear in assets/Templates", () => {
  // Scan templates for NSIDs.
  const templateNsids: Set<string> = new Set();
  const entries: readonly klawSync.Item[] = klawSync(
    "assets/Templates/card/technology",
    {
      nodir: true,
      traverseAll: true,
      filter: (item) => {
        return item.path.endsWith(".json");
      },
    }
  );
  const regex: RegExp = /"(card.technology.unit-upgrade:.*)"/;
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
  const nsids: Array<string> = new UnitAttrsRegistry()
    .loadDefaultData()
    .getAllNsids()
    .filter((nsid) => nsid.startsWith("card.technology.unit-upgrade:"));
  const missing: Array<string> = [];
  for (const nsid of nsids) {
    if (!templateNsids.has(nsid)) {
      missing.push(nsid);
    }
  }
  if (missing.length > 0) {
    console.log("missing", missing.join("\n"));
  }
  expect(missing).toHaveLength(0);
});

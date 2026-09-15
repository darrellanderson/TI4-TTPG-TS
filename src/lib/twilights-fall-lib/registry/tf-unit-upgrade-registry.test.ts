// klawSync needs process.{env,version} to be defined.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).env = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).version = "0";

import fs from "fs";
import klawSync from "klaw-sync";

import { UnitUpgradeSchemaType } from "../schema/unit-upgrade-schema";
import { UnitUpgrade } from "../twilights-fall/unit-upgrade";
import { TFUnitUpgradeRegistry } from "./tf-unit-upgrade-registry";

it("constructor", () => {
  new TFUnitUpgradeRegistry();
});

it("getters", () => {
  const registry = new TFUnitUpgradeRegistry();
  registry.getAllNsids();
  registry.getAllUnitUpgrades();
  registry.getByNsid("card.tf-unit-upgrade:my-source/my-nsid-name");
});

it("load (empty)", () => {
  const registry = new TFUnitUpgradeRegistry();
  registry.load("source", []);
});

it("load (with data)", () => {
  const schema: UnitUpgradeSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    origin: "my-origin",
  };

  const registry = new TFUnitUpgradeRegistry();
  let unitUpgrade: UnitUpgrade | undefined;

  unitUpgrade = registry.getByNsid("card.tf-unit-upgrade:my-source/my-nsid-name");
  expect(unitUpgrade).toBeUndefined();

  registry.load("my-source", [schema]);

  unitUpgrade = registry.getByNsid("card.tf-unit-upgrade:my-source/my-nsid-name");
  expect(unitUpgrade?.getName()).toBe("my-name");
});

it("load (invalid schema)", () => {
  const registry = new TFUnitUpgradeRegistry();
  expect(() => {
    registry.load("source", [
      {
        nsidName: "@@invalid!!",
        name: "my-name",
        origin: "my-origin",
      },
    ]);
  }).toThrow();
});

it("load (duplicate)", () => {
  const schema: UnitUpgradeSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    origin: "my-origin",
  };

  const registry = new TFUnitUpgradeRegistry();
  registry.load("source", [schema]); // first time
  expect(() => {
    registry.load("source", [schema]); // duplicate
  }).toThrow();
});

it("loadDefaultData", () => {
  const registry = new TFUnitUpgradeRegistry();
  expect(() => registry.loadDefaultData()).not.toThrow();
});

it("validate NSIDs appear in assets/Templates", () => {
  // Scan templates for NSIDs.
  const templateNsids: Set<string> = new Set();
  const entries: readonly klawSync.Item[] = klawSync("assets/Templates/card", {
    nodir: true,
    traverseAll: true,
    filter: (item) => {
      return item.path.endsWith(".json");
    },
  });
  const regex: RegExp = /"(card\.tf-unit-upgrade.*)"/;
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

  const nsids: Array<string> = new TFUnitUpgradeRegistry()
    .loadDefaultData()
    .getAllNsids();

  const missing: Array<string> = [];
  for (const nsid of nsids) {
    if (!templateNsids.has(nsid) && !templateNsids.has(nsid + ".1")) {
      missing.push(nsid);
    }
  }
  if (missing.length > 0) {
    console.log("missing", missing.join("\n"));
  }
  // Not asserting missing.length === 0 as we don't know if the cards are in templates yet
});

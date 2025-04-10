// klawSync needs process.{env,version} to be defined.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).env = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).version = "0";

import fs from "fs";
import klawSync from "klaw-sync";

import { RemoveRegistry } from "./remove-registry";

it("constructor", () => {
  new RemoveRegistry();
});

it("load duplicate source", () => {
  const removeRegistry = new RemoveRegistry();
  removeRegistry.load("source", ["nsid"]);
  expect(() => {
    removeRegistry.load("source", ["nsid"]);
  }).toThrow(/Source already exists/);
});

it("getBySource", () => {
  const removeRegistry = new RemoveRegistry().loadDefaultData();
  let nsids: Array<string>;

  nsids = removeRegistry.getRemoveBySource("pok");
  expect(nsids.length).toBeGreaterThan(0);

  nsids = removeRegistry.getRemoveBySource("__no_such_source__");
  expect(nsids.length).toBe(0);
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
  const regex: RegExp = /"(card\..*)"/;
  for (const entry of entries) {
    const data: Buffer = fs.readFileSync(entry.path);
    const lines: Array<string> = data.toString().split("\n");
    for (const line of lines) {
      const match: RegExpMatchArray | null = line.match(regex);
      const nsid: string | undefined = match?.[1];
      if (nsid) {
        const parts: Array<string> = nsid.split("|");
        const firstPart: string | undefined = parts[0];
        if (firstPart) {
          templateNsids.add(firstPart);
        }
      }
    }
  }

  const nsids: Array<string> = new RemoveRegistry()
    .loadDefaultData()
    .getAllNsids();
  expect(nsids.length).toBeGreaterThan(0);

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

it("static createFromRegistry", () => {
  const registry: RemoveRegistry = new RemoveRegistry().loadDefaultData();
  TI4.config.setSources(["base", "pok"]);
  const remove = registry.createRemoveFromRegistryAndConfig();
  expect(remove.hasSource("pok")).toBe(false);
  expect(remove.hasSource("codex.vigil")).toBe(true);
  expect(remove.hasNsid("card.agenda:base/research-team-warfare")).toBe(true);
});

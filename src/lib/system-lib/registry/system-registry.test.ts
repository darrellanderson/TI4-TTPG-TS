// klawSync needs process.{env,version} to be defined.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).env = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).version = "0";

import fs from "fs";
import klawSync from "klaw-sync";

import { MockContainer, MockGameObject } from "ttpg-mock";
import { SystemRegistry } from "./system-registry";
import { GameObject, Vector, world } from "@tabletop-playground/api";
import { SystemSchemaType } from "../schema/system-schema";
import { NSID, ParsedNSID } from "ttpg-darrell";
import { Planet } from "../planet/planet";
import { System } from "../system/system";

it("constructor", () => {
  new SystemRegistry();
});

it("onObjectCreated/Destroyed", () => {
  const registry = new SystemRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [{ tile: 1000 }]
  );
  expect(registry.rawBySystemTileNumber(1000)).toBeDefined();

  const systemTileObj: GameObject = new MockGameObject({
    id: "my-id",
    templateMetadata: "tile.system:my-source/1000",
  });
  expect(registry.rawBySystemTileNumber(1000)).toBeDefined();
  expect(registry.getBySystemTileObjId("my-id")).toBeDefined();

  systemTileObj.destroy();
  expect(registry.rawBySystemTileNumber(1000)).toBeDefined();
  expect(registry.getBySystemTileObjId("my-id")).toBeUndefined();

  registry.destroy();
});

it("load (system tile obj exists at load time)", () => {
  const systemTileObj: GameObject = new MockGameObject({
    id: "my-id",
    templateMetadata: "tile.system:my-source/1000",
  });
  const registry = new SystemRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [{ tile: 1000 }]
  );
  expect(registry.rawBySystemTileNumber(1000)).toBeDefined();
  expect(registry.getBySystemTileObjId("my-id")).toBeDefined();

  systemTileObj.destroy();
  expect(registry.rawBySystemTileNumber(1000)).toBeDefined();
  expect(registry.getBySystemTileObjId("my-id")).toBeUndefined();

  registry.destroy();
});

it("load (duplicate system tile)", () => {
  const registry = new SystemRegistry();
  expect(registry.rawBySystemTileNumber(12)).toBeUndefined();

  // Add first.
  registry.load({ source: "base", packageId: "my-package-id" }, [
    { tile: 1002, wormholes: ["alpha"] },
  ]);
  expect(registry.rawBySystemTileNumber(1002)?.wormholes).toEqual(["alpha"]);

  // Add duplicate, expect ignored but non-duplicate entries still added.
  expect(() => {
    registry.load({ source: "homebrew", packageId: "my-package-id" }, [
      { tile: 1001, wormholes: ["beta"] },
      { tile: 1002, wormholes: ["beta"] },
      { tile: 1003 },
    ]);
  }).toThrow();
  expect(registry.rawBySystemTileNumber(1001)?.wormholes).toEqual(["beta"]);
  expect(registry.rawBySystemTileNumber(1002)?.wormholes).toEqual(["alpha"]); // not overwritten
  expect(registry.rawBySystemTileNumber(1003)).toBeUndefined(); // throw before added

  registry.destroy();
});

it("load (invalid schema)", () => {
  const registry = new SystemRegistry();
  expect(() => {
    registry.load({ source: "my-source", packageId: "my-package-id" }, [
      { tile: 1000, planets: [{ name: "x", nsidName: "@@" }] },
    ]);
  }).toThrow();
  registry.destroy();
});

it("loadDefaultData", () => {
  const registry = new SystemRegistry();
  expect(registry.rawBySystemTileNumber(1)).toBeUndefined();
  registry.loadDefaultData();
  expect(registry.rawBySystemTileNumber(1)).toBeDefined();
  registry.destroy();
});

it("getAllDraftableSystemsFilteredByConfigSources", () => {
  const registry = new SystemRegistry().loadDefaultData();

  // Only finds systems in the game world.
  MockGameObject.simple("tile.system:base/1"); // home
  MockGameObject.simple("tile.system:base/18"); // exlude from draft
  MockGameObject.simple("tile.system:base/19");
  MockGameObject.simple("tile.system:pok/59"); // pok

  let systems: Array<System>;

  TI4.config.setSources(["base"]);
  systems = registry.getAllDraftableSystemsFilteredByConfigSources();
  expect(systems).toHaveLength(1);

  TI4.config.setSources(["base", "pok"]);
  systems = registry.getAllDraftableSystemsFilteredByConfigSources();
  expect(systems).toHaveLength(2);

  registry.destroy();
});

it("getAllSystemsWithObjs", () => {
  const registry = new SystemRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [
      {
        tile: 1000,
        planets: [{ name: "my-planet-name", nsidName: "my-planet-nsid" }],
      },
    ]
  );
  const obj = new MockGameObject({
    id: "my-id-1",
    templateMetadata: "tile.system:my-source/1000",
  });
  new MockGameObject({
    id: "my-id-2",
    templateMetadata: "tile.system:my-source/1000",
    container: new MockContainer(),
  });
  expect(registry.getAllSystemsWithObjs()).toHaveLength(2);
  expect(registry.getAllSystemsWithObjs(true)).toHaveLength(1); // skip contained

  let planet: Planet | undefined;
  planet = registry.getPlanetByPlanetCardNsid(
    "card.planet:my-source/my-planet-nsid"
  );
  expect(planet).toBeDefined();
  planet = registry.getPlanetByPlanetCardNsid("card.planet:my-source/invalid");
  expect(planet).toBeUndefined();

  obj.destroy();
  expect(obj.isValid()).toBeFalsy();
  expect(registry.getAllSystemsWithObjs()).toHaveLength(1);
  registry.destroy();
});

it("getByPosition", () => {
  const z: number = world.getTableHeight();
  const pos = new Vector(0, 0, z);
  const registry = new SystemRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [{ tile: 1000 }]
  );
  expect(registry.getByPosition(pos)).toBeUndefined();

  const obj = new MockGameObject({
    id: "my-id",
    position: pos,
    templateMetadata: "tile.system:my-source/1000",
  });
  expect(registry.getByPosition(pos)).toBeDefined();

  obj.destroy();
  expect(registry.getByPosition(pos)).toBeUndefined();
  registry.destroy();
});

it("tileNumberToSystemTileObjNsid", () => {
  const registry = new SystemRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [{ tile: 1000 }]
  );
  let nsid: string | undefined;

  nsid = registry.tileNumberToSystemTileObjNsid(1000);
  expect(nsid).toEqual("tile.system:my-source/1000");

  nsid = registry.tileNumberToSystemTileObjNsid(999);
  expect(nsid).toBeUndefined();

  registry.destroy();
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
  const regex: RegExp = /"(card\.planet:.*|tile\.system:.*)"/;
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

  const registry = new SystemRegistry().loadDefaultData();
  const tileNumbers: Array<number> = registry.getAllSystemTileNumbers();
  const nsids: Array<string> = [];
  for (const tileNumber of tileNumbers) {
    const nsid: string | undefined =
      registry.tileNumberToSystemTileObjNsid(tileNumber);
    if (!nsid) {
      throw new Error(`No NSID for tile number ${tileNumber}`);
    }

    // System tile nsids.
    nsids.push(nsid);

    // Planet card nsids.
    const schema: SystemSchemaType | undefined =
      registry.rawBySystemTileNumber(tileNumber);
    if (!schema) {
      throw new Error(`No schema for tile number ${tileNumber}`);
    }
    const parsed: ParsedNSID | undefined = NSID.parse(nsid);
    if (!parsed) {
      throw new Error(`Invalid NSID: ${nsid}`);
    }
    const source: string = parsed.sourceParts.join("-");
    for (const planet of schema.planets ?? []) {
      const nsid: string = `card.planet:${source}/${planet.nsidName}`;
      nsids.push(nsid);
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

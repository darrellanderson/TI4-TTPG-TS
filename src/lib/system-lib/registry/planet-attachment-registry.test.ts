// klawSync needs process.{env,version} to be defined.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).env = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).version = "0";

import fs from "fs";
import klawSync from "klaw-sync";

import { GameObject, Vector } from "@tabletop-playground/api";
import { MockContainer, MockGameObject } from "ttpg-mock";

import { Planet } from "../planet/planet";
import { PlanetAttachment } from "../planet-attachment/planet-attachment";
import { PlanetAttachmentRegistry } from "./planet-attachment-registry";
import { System } from "../system/system";

it("constructor", () => {
  new PlanetAttachmentRegistry();
});

it("object create/desroy", () => {
  const registry = new PlanetAttachmentRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [
      {
        name: "my-name",
        nsidName: "my-nsid-name",
      },
    ]
  );
  expect(registry.getByPlanetAttachmentObjId("my-id")).toBeUndefined();

  const token: GameObject = new MockGameObject({
    id: "my-id",
    templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
  });
  expect(registry.getByPlanetAttachmentObjId("my-id")).toBeDefined();

  token.destroy();
  expect(registry.getByPlanetAttachmentObjId("my-id")).toBeUndefined();

  registry.destroy();
});

it("getAllNsids", () => {
  new PlanetAttachmentRegistry().getAllNsids();
});

it("getByCardNsid", () => {
  const registry = new PlanetAttachmentRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [{ name: "my-name", nsidName: "my-nsid-name" }]
  );
  expect(
    registry.getByCardNsid("card.exploration.industrial:my-source/my-nsid-name")
  ).toBeUndefined();

  const token: GameObject = new MockGameObject({
    id: "my-id",
    templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
  });
  new MockContainer({ items: [token] });

  expect(
    registry.getByCardNsid("card.exploration.industrial:my-source/my-nsid-name")
  ).toBeDefined();

  token.destroy();
  expect(
    registry.getByCardNsid("card.exploration.industrial:my-source/my-nsid-name")
  ).toBeUndefined();

  registry.destroy();
});

it("getByPlanetAttachmentObjId", () => {
  const registry = new PlanetAttachmentRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [{ name: "my-name", nsidName: "my-nsid-name" }]
  );
  new MockGameObject({
    id: "my-id",
    templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
  });
  expect(registry.getByPlanetAttachmentObjId("my-id")).toBeDefined();
});

it("init attaches", () => {
  new MockGameObject({
    templateMetadata: "tile.system:base/1",
  });
  const system: System | undefined = TI4.systemRegistry.getByPosition(
    new Vector(0, 0, 0)
  );
  expect(system).toBeDefined();
  if (!system) {
    throw new Error("system not found"); // for TypeScript
  }
  const planet: Planet | undefined = system.getPlanets()[0];
  expect(planet).toBeDefined();
  if (!planet) {
    throw new Error("planet not found"); // for TypeScript
  }

  // Token exists before registry is created.
  new MockGameObject({
    id: "my-id",
    templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
  });
  const registry = new PlanetAttachmentRegistry();
  expect(
    registry.rawByNsid("token.attachment.planet:my-source/my-nsid-name")
  ).toBeUndefined();

  registry.load({ source: "my-source", packageId: "my-package-id" }, [
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    },
  ]);
  expect(
    registry.rawByNsid("token.attachment.planet:my-source/my-nsid-name")
  ).toBeDefined();
  const attachment: PlanetAttachment | undefined =
    registry.getByPlanetAttachmentObjId("my-id");
  expect(attachment).toBeDefined();
  if (!attachment) {
    throw new Error("attachment not found"); // for TypeScript
  }

  expect(planet.hasAttachment(attachment)).toBe(false);

  registry.init();
  expect(planet.hasAttachment(attachment)).toBe(true);

  registry.destroy();
});

it("load (corrupt data)", () => {
  expect(() => {
    new PlanetAttachmentRegistry().load(
      { source: "my-source", packageId: "my-package-id" },
      [{ name: "my-name", nsidName: "@@invalid" }]
    );
  }).toThrow();
});

it("load (do not attach)", () => {
  const registry = new PlanetAttachmentRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [
      {
        name: "my-name",
        nsidName: "my-nsid-name",
        doNotAttach: true,
      },
    ]
  );
  expect(
    registry.rawByNsid("token.attachment.planet:my-source/my-nsid-name")
  ).toBeUndefined();
  registry.destroy();
});

it("loadDefaultData", () => {
  const registry = new PlanetAttachmentRegistry();
  const nsid: string = "token.attachment.planet:pok/demilitarized-zone";
  expect(registry.rawByNsid(nsid)).toBeUndefined();
  registry.loadDefaultData();
  expect(registry.rawByNsid(nsid)).toBeDefined();
  registry.destroy();
});

it("validate exploration cards", () => {
  const cardNsids: Array<string> = [
    "card.exploration.industrial:pok/biotic-research-facility",
    "card.exploration.industrial:pok/cybernetic-research-facility",
    "card.exploration.cultural:pok/demilitarized-zone",
    "card.exploration.cultural:pok/dyson-sphere",
    "card.exploration.hazardous:pok/lazax-survivors",
    "card.exploration.hazardous:pok/mining-world",
    "card.exploration.cultural:pok/paradise-world",
    "card.exploration.industrial:pok/propulsion-research-facility",
    "card.exploration.hazardous:pok/rich-world",
    "card.exploration.cultural:pok/tomb-of-emphidia",
    "card.exploration.hazardous:pok/warfare-research-facility",
  ];

  const registry = new PlanetAttachmentRegistry().loadDefaultData();
  expect(registry.rawByCardNsid("_does_not_exist_")).toBeUndefined();
  for (const cardNsid of cardNsids) {
    expect(registry.rawByCardNsid(cardNsid)).toBeDefined();
  }
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
  const regex: RegExp = /"(token.attachment.planet:.*)"/;
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

  const registry = new PlanetAttachmentRegistry().loadDefaultData();
  const nsids: Array<string> = registry.getAllNsids();

  const missing: Array<string> = [];
  for (const nsid of nsids) {
    // XXX TODO REMOVE WHEN RELEASED
    if (nsid.includes(":thunders-edge/")) {
      continue;
    }

    if (!templateNsids.has(nsid) && !templateNsids.has(nsid + ".1")) {
      missing.push(nsid);
    }
  }
  if (missing.length > 0) {
    console.log("missing", missing.join("\n"));
  }
  expect(missing).toHaveLength(0);
});

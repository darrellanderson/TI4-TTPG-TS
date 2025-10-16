// klawSync needs process.{env,version} to be defined.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).env = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).version = "0";

import fs from "fs";
import klawSync from "klaw-sync";

import { GameObject } from "@tabletop-playground/api";
import { MockContainer, MockGameObject } from "ttpg-mock";

import { SystemAttachmentRegistry } from "./system-attachment-registry";
import { System } from "../system/system";
import { SystemAttachment } from "../system-attachment/system-attachment";

it("constuctor", () => {
  new SystemAttachmentRegistry();
});

it("object create/desroy", () => {
  const registry = new SystemAttachmentRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [
      {
        name: "my-name",
        nsidName: "my-nsid-name",
      },
    ]
  );
  expect(
    registry.rawByNsid("token.attachment.system:my-source/my-nsid-name")
  ).toBeDefined();
  expect(registry.getBySystemAttachmentObjId("my-id")).toBeUndefined();

  const token: GameObject = new MockGameObject({
    id: "my-id",
    templateMetadata: "token.attachment.system:my-source/my-nsid-name",
  });
  expect(registry.getBySystemAttachmentObjId("my-id")).toBeDefined();

  token.destroy();
  expect(registry.getBySystemAttachmentObjId("my-id")).toBeUndefined();

  registry.destroy();
});

it("load (invalid)", () => {
  const registry = new SystemAttachmentRegistry();
  expect(() => {
    registry.load({ source: "my-source", packageId: "my-package-id" }, [
      {
        name: "my-name",
        nsidName: "@@invalid",
      },
    ]);
  }).toThrow();
  registry.destroy();
});

it("load (do not attach)", () => {
  const registry = new SystemAttachmentRegistry().load(
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
    registry.rawByNsid("token.attachment.system:my-source/my-nsid-name")
  ).toBeUndefined();
  registry.destroy();
});

it("token existed at load time, not attached until init.", () => {
  // Create system (picked up by global TI4.systemRegistry).
  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:base/1",
  });
  const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
    systemTileObj.getId()
  );
  expect(system).toBeDefined();
  if (!system) {
    throw new Error("system not defined"); // for TypeScript
  }

  const registry = new SystemAttachmentRegistry();
  expect(registry.getBySystemAttachmentObjId("my-id")).toBeUndefined();

  // Create attachment token.
  const tokenNsid: string = "token.attachment.system:my-source/my-nsid-name";
  const token: GameObject = new MockGameObject({
    id: "my-id",
    templateMetadata: tokenNsid,
  });
  new MockContainer({ items: [token] });
  expect(registry.getBySystemAttachmentObjId("my-id")).toBeUndefined();

  expect(
    registry.getByCardNsid("card.exploration.industrial:my-source/my-nsid-name")
  ).toBeUndefined();

  registry.load({ source: "my-source", packageId: "my-package-id" }, [
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    },
  ]);
  const attachment: SystemAttachment | undefined =
    registry.getBySystemAttachmentObjId("my-id");
  expect(attachment).toBeDefined();
  if (!attachment) {
    throw new Error("attachment not defined"); // for TypeScript
  }

  expect(
    registry.getByCardNsid("card.exploration.industrial:my-source/my-nsid-name")
  ).toBeDefined();

  expect(system.hasAttachment(attachment)).toBe(false);

  registry.init();
  expect(system?.hasAttachment(attachment)).toBe(true);

  registry.destroy();
});

it("loadDefaultData", () => {
  const registry = new SystemAttachmentRegistry();
  const nsid: string = "token.attachment.system:base/wormhole-alpha.creuss";
  expect(registry.rawByNsid(nsid)).toBeUndefined();
  registry.loadDefaultData();
  expect(registry.rawByNsid(nsid)).toBeDefined();
  registry.destroy();
});

it("validate exploration cards", () => {
  const cardNsids: Array<string> = [
    "card.exploration.frontier:pok/ion-storm",
    "card.exploration.frontier:pok/mirage",
    "card.exploration.cultural:pok/gamma-wormhole",
    "card.exploration.frontier:pok/gamma-relay",
  ];

  const registry = new SystemAttachmentRegistry().loadDefaultData();
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
  const regex: RegExp = /"(token.attachment.system:.*)"/;
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

  const registry = new SystemAttachmentRegistry().loadDefaultData();
  const nsids: Array<string> = registry.getAllNsids();

  const missing: Array<string> = [];
  for (const nsid of nsids) {
    // TODO XXX REMOVE WHEN RELEASED
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

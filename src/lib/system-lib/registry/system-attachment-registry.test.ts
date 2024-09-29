import { GameObject, Package } from "@tabletop-playground/api";
import { MockGameObject, MockPackage, mockWorld } from "ttpg-mock";

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
    ],
  );
  expect(
    registry.rawByNsid("token.attachment.system:my-source/my-nsid-name"),
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
    ],
  );
  expect(
    registry.rawByNsid("token.attachment.system:my-source/my-nsid-name"),
  ).toBeUndefined();
  registry.destroy();
});

it("token existed at load time, not attached until init.", () => {
  // Create system (picked up by global TI4.systemRegistry).
  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:base/1",
  });
  const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
    systemTileObj.getId(),
  );
  expect(system).toBeDefined();
  if (!system) {
    throw new Error("system not defined"); // for TypeScript
  }

  const registry = new SystemAttachmentRegistry();
  expect(registry.getBySystemAttachmentObjId("my-id")).toBeUndefined();

  // Create attachment token.
  const tokenNsid: string = "token.attachment.system:my-source/my-nsid-name";
  new MockGameObject({
    id: "my-id",
    templateMetadata: tokenNsid,
  });
  expect(registry.getBySystemAttachmentObjId("my-id")).toBeUndefined();

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

it("validateImages", () => {
  const registry = new SystemAttachmentRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [{ name: "my-name", nsidName: "my-nsid-name", imgFaceDown: true }],
  );
  const myPackage: Package = new MockPackage({
    textureFiles: [
      "token/attachment/system/my-nsid-name.png",
      "token/attachment/system/my-nsid-name.back.png",
    ],
    uniqueId: "my-package-id",
  });
  mockWorld._reset({ packages: [myPackage] });
  registry.validateImages();
  registry.destroy();
});

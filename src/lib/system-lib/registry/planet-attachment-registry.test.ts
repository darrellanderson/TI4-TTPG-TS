import { GameObject, Package, Vector } from "@tabletop-playground/api";
import { MockGameObject, MockPackage, mockWorld } from "ttpg-mock";

import { Planet } from "../planet/planet";
import { PlanetAttachment } from "../planet-attachment/planet-attachment";
import { PlanetAttachmentRegistry } from "./planet-attachment-registry";
import { System } from "../system/system";
import { resetGlobalThisTI4 } from "../../../global/global";

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

it("getByPlanetAttachmentObjId", () => {
  const registry = new PlanetAttachmentRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [{ name: "my-name", nsidName: "my-nsid-name" }]
  );
  const token: GameObject = new MockGameObject({
    id: "my-id",
    templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
  });
  expect(registry.getByPlanetAttachmentObjId("my-id")).toBeDefined();
});

it("init attaches", () => {
  resetGlobalThisTI4(); // for TI4.systemRegistry
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
  const registry = new PlanetAttachmentRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [
      {
        name: "my-name",
        nsidName: "my-nsid-name",
      },
    ]
  );
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

it("validateImages", () => {
  const registry = new PlanetAttachmentRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [{ name: "my-name", nsidName: "my-nsid-name", imgFaceDown: true }]
  );
  const myPackage: Package = new MockPackage({
    textureFiles: [
      "token/attachment/planet/my-source/my-nsid-name.png",
      "token/attachment/planet/my-source/my-nsid-name.back.png",
    ],
    uniqueId: "my-package-id",
  });
  mockWorld._reset({ packages: [myPackage] });
  registry.validateImages();
  registry.destroy();
});

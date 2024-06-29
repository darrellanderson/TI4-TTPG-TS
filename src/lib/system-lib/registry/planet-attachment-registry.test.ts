import { GameObject, Package, Vector } from "@tabletop-playground/api";
import { MockGameObject, MockPackage, mockWorld } from "ttpg-mock";

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
  const nsid: string = "token.attachment.planet:pok/dmz";
  expect(registry.rawByNsid(nsid)).toBeUndefined();
  registry.loadDefaultData();
  expect(registry.rawByNsid(nsid)).toBeDefined();
  registry.destroy();
});

it("validateImages", () => {
  const registry = new PlanetAttachmentRegistry().load(
    { source: "my-source", packageId: "my-package-id" },
    [{ name: "my-name", nsidName: "my-nsid-name", imgFaceDown: true }]
  );
  const myPackage: Package = new MockPackage({
    textureFiles: [
      "token/attachment/planet/my-nsid-name.png",
      "token/attachment/planet/my-nsid-name.back.png",
    ],
    uniqueId: "my-package-id",
  });
  mockWorld._reset({ packages: [myPackage] });
  registry.validateImages();
  registry.destroy();
});

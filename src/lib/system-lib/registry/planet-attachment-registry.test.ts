import { MockGameObject } from "ttpg-mock";
import { PlanetAttachmentRegistry } from "./planet-attachment-registry";
import { GameObject } from "@tabletop-playground/api";

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

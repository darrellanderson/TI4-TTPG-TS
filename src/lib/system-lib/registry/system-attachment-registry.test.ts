import { MockGameObject } from "ttpg-mock";
import { SystemAttachmentRegistry } from "./system-attachment-registry";
import { GameObject } from "@tabletop-playground/api";

it("constuctor", () => {
  new SystemAttachmentRegistry();
});

it("object create/desroy", () => {
  const registry = new SystemAttachmentRegistry().load(
    [
      {
        name: "my-name",
        nsidName: "my-nsid-name",
      },
    ],
    "my-source"
  );
  expect(registry.getBySystemAttachmentObjId("my-id")).toBeUndefined();

  const token: GameObject = new MockGameObject({
    id: "my-id",
    templateMetadata: "token.attachment:my-source/my-nsid-name",
  });
  expect(registry.getBySystemAttachmentObjId("my-id")).toBeDefined();

  token.destroy();
  expect(registry.getBySystemAttachmentObjId("my-id")).toBeUndefined();

  registry.destroy();
});

it("load (invalid)", () => {
  const registry = new SystemAttachmentRegistry();
  expect(() => {
    registry.load(
      [
        {
          name: "my-name",
          nsidName: "@@invalid",
        },
      ],
      "my-source"
    );
  }).toThrow();
  registry.destroy();
});

it("token existed at load time", () => {
  const registry = new SystemAttachmentRegistry();
  expect(registry.getBySystemAttachmentObjId("my-id")).toBeUndefined();

  const token: GameObject = new MockGameObject({
    id: "my-id",
    templateMetadata: "token.attachment:my-source/my-nsid-name",
  });
  registry.load(
    [
      {
        name: "my-name",
        nsidName: "my-nsid-name",
      },
    ],
    "my-source"
  );
  expect(registry.getBySystemAttachmentObjId("my-id")).toBeDefined();
  registry.destroy();
});

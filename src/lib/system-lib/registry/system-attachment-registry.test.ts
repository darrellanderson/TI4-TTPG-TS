import { MockGameObject, MockPlayer } from "ttpg-mock";
import { SystemAttachmentRegistry } from "./system-attachment-registry";
import { GameObject, Player } from "@tabletop-playground/api";
import { resetGlobalThisTI4 } from "../../../global/global";
import { System } from "../system/system";
import { SystemAttachment } from "../system-attachment/system-attachment";

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

it("object release/grab", () => {
  // Reset TI4.systemRegistry because globalEvents gets reset between tests.
  resetGlobalThisTI4();
  expect(TI4.systemRegistry.rawBySystemTileNumber(1)).toBeDefined(); // defaults
  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: `tile.system:my-source/1`,
    position: [1, 0, 0],
  });
  const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
    systemTileObj.getId()
  );
  expect(system).toBeDefined();

  const registry = new SystemAttachmentRegistry().load(
    [
      {
        name: "my-name",
        nsidName: "my-nsid-name",
      },
    ],
    "my-source"
  );
  const attachmentToken: MockGameObject = new MockGameObject({
    id: "my-id",
    templateMetadata: "token.attachment:my-source/my-nsid-name",
    position: [1, 0, 0],
  });
  const attachment: SystemAttachment | undefined =
    registry.getBySystemAttachmentObjId("my-id");
  const attachmentNsid: string = attachment?.getNsid() ?? "";
  expect(attachment).toBeDefined();
  expect(system?.hasAttachment(attachmentNsid)).toBe(false);

  const player: Player = new MockPlayer();

  attachmentToken._releaseAsPlayer(player, false);
  expect(system?.hasAttachment(attachmentNsid)).toBe(true);

  attachmentToken._grabAsPlayer(player);
  expect(system?.hasAttachment(attachmentNsid)).toBe(false);

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

it("token existed at load time, not attached until init.", () => {
  resetGlobalThisTI4();

  // Create system (picked up by global TI4.systemRegistry).
  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:base/1",
  });
  const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
    systemTileObj.getId()
  );
  expect(system).toBeDefined();

  const registry = new SystemAttachmentRegistry();
  expect(registry.getBySystemAttachmentObjId("my-id")).toBeUndefined();

  // Create attachment token.
  const tokenNsid: string = "token.attachment:my-source/my-nsid-name";
  new MockGameObject({
    id: "my-id",
    templateMetadata: tokenNsid,
  });
  expect(registry.getBySystemAttachmentObjId("my-id")).toBeUndefined();

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
  expect(system?.hasAttachment(tokenNsid)).toBe(false);

  registry.init();
  expect(system?.hasAttachment(tokenNsid)).toBe(true);

  registry.destroy();
});

it("load after init, attaches to system", () => {
  resetGlobalThisTI4();

  // Create system (picked up by global TI4.systemRegistry).
  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:base/1",
    position: [1, 0, 0],
  });
  const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
    systemTileObj.getId()
  );
  expect(system).toBeDefined();

  // Create attachment token.
  const tokenNsid: string = "token.attachment:my-source/my-nsid-name";
  new MockGameObject({
    id: "my-id",
    templateMetadata: tokenNsid,
    position: [1, 0, 0],
  });
  expect(system?.hasAttachment(tokenNsid)).toBe(false);

  // Create and init registry (load after init will attach at load time).
  const registry = new SystemAttachmentRegistry();
  registry.init();
  registry.load(
    [
      {
        name: "my-name",
        nsidName: "my-nsid-name",
      },
    ],
    "my-source"
  );

  // Shoule be attached.
  expect(system?.hasAttachment("token.attachment:my-source/my-nsid-name")).toBe(
    true
  );

  registry.destroy();
});

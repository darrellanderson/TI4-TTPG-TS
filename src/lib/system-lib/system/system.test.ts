import { MockGameObject } from "ttpg-mock";
import { System, WormholeWithGlobalPosition } from "./system";
import { GameObject, Vector, refPackageId } from "@tabletop-playground/api";
import { SystemSchemaType } from "../schema/system-schema";
import { SystemAttachment } from "../system-attachment/system-attachment";

it("setSystemTileObjId", () => {
  const params: SystemSchemaType = {
    tile: 1,
    source: "my-source",
  };
  const system = new System(params);
  expect(system.getSystemTileObjId()).toBeUndefined();

  system.setSystemTileObjId("my-id");
  expect(system.getSystemTileObjId()).toBe("my-id");
});

it("worldPositionToLocal", () => {
  const params: SystemSchemaType = {
    tile: 1,
    source: "my-source",
  };
  const system = new System(params);
  const globalPosition = new Vector(1, 2, 3);
  expect(system.worldPositionToLocal(globalPosition)).toBeUndefined();

  new MockGameObject({
    id: "my-system-tile-id",
    position: [10, 20, 30],
  });
  system.setSystemTileObjId("my-system-tile-id");

  expect(system.worldPositionToLocal(globalPosition)?.toString()).toBe(
    "(X=-9,Y=-18,Z=-27)"
  );
});

it("localPositionToWorld", () => {
  const params: SystemSchemaType = {
    tile: 1,
    source: "my-source",
  };
  const system = new System(params);
  const localPosition = new Vector(1, 2, 3);
  expect(system.localPositionToWorld(localPosition)).toBeUndefined();

  new MockGameObject({
    id: "my-system-tile-id",
    position: [10, 20, 30],
  });
  system.setSystemTileObjId("my-system-tile-id");

  expect(system.localPositionToWorld(localPosition)?.toString()).toBe(
    "(X=11,Y=22,Z=33)"
  );
});

it("getSystemTileObj (valid)", () => {
  const params: SystemSchemaType = {
    tile: 1,
    source: "my-source",
  };
  const system = new System(params);
  expect(system.getSystemTileObj()).toBeUndefined();

  const systemTileObj = new MockGameObject({
    id: "my-system-tile-id",
  });
  system.setSystemTileObjId("my-system-tile-id");
  expect(system.getSystemTileObj()).toBe(systemTileObj);
});

it("getSystemTileObj (invalid object)", () => {
  const params: SystemSchemaType = {
    tile: 1,
    source: "my-source",
  };
  const system = new System(params);
  expect(system.getSystemTileObj()).toBeUndefined();

  const systemTileObj = new MockGameObject({
    id: "my-system-tile-id",
  });
  system.setSystemTileObjId("my-system-tile-id");
  expect(system.getSystemTileObj()).toBe(systemTileObj);

  systemTileObj.destroy();
  expect(system.getSystemTileObj()).toBeUndefined();
});

it("getSystemTileObj (invalid id)", () => {
  const params: SystemSchemaType = {
    tile: 1,
    source: "my-source",
  };
  const system = new System(params);
  expect(system.getSystemTileObj()).toBeUndefined();

  system.setSystemTileObjId("no-such-id");
  expect(system.getSystemTileObj()).toBeUndefined();
});

it("attachment management", () => {
  const system = new System({
    tile: 1,
    source: "my-source",
  });
  const attachment = new SystemAttachment({
    name: "my-name",
    nsid: "my-nsid",
  });
  expect(system.hasAttachment("my-nsid")).toBe(false);

  system.addAttachment(attachment);
  expect(system.hasAttachment("my-nsid")).toBe(true);

  system.delAttachment("my-nsid");
  expect(system.hasAttachment("my-nsid")).toBe(false);
});

it("getAnomalies", () => {
  const system = new System({
    tile: 1,
    source: "my-source",

    anomalies: ["asteroid_field"],
  });
  const attachment = new SystemAttachment({
    name: "my-name",
    nsid: "my-nsid",
    anomalies: ["gravity_rift"],
  });
  system.addAttachment(attachment);
  expect(system.getAnomalies()).toEqual(["asteroid_field", "gravity_rift"]);
});

it("getImg", () => {
  const system = new System({
    tile: 1,
    source: "my-source",

    img: "my-img",
    imgPackageId: "my-package-id",
  });
  expect(system.getImg()).toBe("my-img:my-package-id");
});

it("getImg (no package id)", () => {
  const system = new System({
    tile: 1,
    source: "my-source",

    img: "my-img",
  });
  expect(system.getImg()).toBe(`my-img:${refPackageId}`);
});

it("getImg (none)", () => {
  const system = new System({
    tile: 1,
    source: "my-source",
  });
  expect(system.getImg()).toBeUndefined();
});

it("getPlanets", () => {
  const system = new System({
    tile: 1,
    source: "my-source",

    planets: [
      { name: "planet-1", cardNsid: "my-card-nsid-1" },
      { name: "planet-2", cardNsid: "my-card-nsid-2" },
    ],
  });
  const attachment = new SystemAttachment({
    name: "attachment-1",
    nsid: "attachment-1-nsid",
    planets: [{ name: "planet-3", cardNsid: "my-card-nsid" }],
  });
  system.addAttachment(attachment);

  expect(system.getPlanets().map((planet) => planet.getName())).toEqual([
    "planet-1",
    "planet-2",
    "planet-3",
  ]);
});

it("getTile", () => {
  const system = new System({
    tile: 1,
    source: "my-source",
  });
  expect(system.getTile()).toBe(1);
});

it("getWormholes", () => {
  const system = new System({
    tile: 1,
    source: "my-source",

    wormholes: ["alpha"],
  });
  const attachment = new SystemAttachment({
    name: "attachment-1",
    nsid: "attachment-1-nsid",
    wormholes: ["beta"],
  });
  system.addAttachment(attachment);

  expect(system.getWormholes()).toEqual(["alpha", "beta"]);
});

it("getWormholes face down", () => {
  const system = new System({
    tile: 1,
    source: "my-source",

    wormholesWithPositions: [
      { wormhole: "alpha", localPosition: { x: 1, y: 2 } },
    ],
    wormholesFaceDown: ["gamma"],
    wormholesWithPositionsFaceDown: [
      { wormhole: "delta", localPosition: { x: 1, y: 2 } },
    ],
  });
  const attachment = new SystemAttachment({
    name: "attachment-1",
    nsid: "attachment-1-nsid",
    wormholes: ["beta"],
  });
  system.addAttachment(attachment);

  // Before attaching system tile.
  expect(system.getWormholes()).toEqual(["alpha", "beta"]);

  // Link face-down system tile.
  const systemTile: GameObject = new MockGameObject({
    rotation: [0, 0, 180],
  });
  system.setSystemTileObjId(systemTile.getId());
  expect(system.getWormholes()).toEqual(["gamma", "delta", "beta"]);
});

it("getWormholesWithGlobalPosition", () => {
  const system = new System({
    tile: 1,
    source: "my-source",

    wormholes: ["alpha"],
  });
  const attachment = new SystemAttachment({
    name: "attachment-1",
    nsid: "attachment-1-nsid",
    wormholes: ["beta"],
  });
  system.addAttachment(attachment);

  let out: Array<WormholeWithGlobalPosition>;
  let summary: Array<string>;

  // Before linking system tile object, uses origin as global position.
  out = system.getWormholesWithGlobalPositions();
  summary = out.map((w) => `${w.wormhole}:${w.globalPosition.toString()}`);
  expect(summary).toEqual(["alpha:(X=0,Y=0,Z=0)", "beta:(X=0,Y=0,Z=0)"]);

  // Link system tile object and attachment token.
  const systemTile: GameObject = new MockGameObject({
    position: [10, 20, 30],
  });
  const attachmentToken: GameObject = new MockGameObject({
    position: [1, 2, 3],
  });
  system.setSystemTileObjId(systemTile.getId());
  attachment.setAttachmentObjId(attachmentToken.getId());

  out = system.getWormholesWithGlobalPositions();
  summary = out.map((w) => `${w.wormhole}:${w.globalPosition.toString()}`);
  expect(summary).toEqual(["alpha:(X=10,Y=20,Z=30)", "beta:(X=1,Y=2,Z=3)"]);

  // Link the attachment object.
});

it("isHome", () => {
  const system = new System({
    tile: 1,
    source: "my-source",

    isHome: true,
  });
  expect(system.isHome()).toBe(true);
});

it("isHome (default)", () => {
  const system = new System({
    tile: 1,
    source: "my-source",
  });
  expect(system.isHome()).toBe(false);
});

it("isHyperlane", () => {
  const system = new System({
    tile: 1,
    source: "my-source",

    isHyperlane: true,
  });
  expect(system.isHyperlane()).toBe(true);
});

it("isHyperlane (default)", () => {
  const system = new System({
    tile: 1,
    source: "my-source",
  });
  expect(system.isHyperlane()).toBe(false);
});

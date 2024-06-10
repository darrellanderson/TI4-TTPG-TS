import { MockGameObject } from "ttpg-mock";
import { System, WormholeWithGlobalPosition } from "./system";
import { GameObject, Vector, refPackageId } from "@tabletop-playground/api";
import { SystemSchemaType } from "../schema/system-schema";
import { SystemAttachment } from "../system-attachment/system-attachment";

it("setSystemTileObjId", () => {
  const params: SystemSchemaType = {
    tile: 1,
  };
  const system = new System(params);
  expect(system.getSystemTileObjId()).toBeUndefined();

  system.setSystemTileObjId("my-id");
  expect(system.getSystemTileObjId()).toBe("my-id");
});

it("getLocalPosition", () => {
  const params: SystemSchemaType = {
    tile: 1,
  };
  const system = new System(params);
  const globalPosition = new Vector(1, 2, 3);
  expect(system.getLocalPosition(globalPosition)).toBeUndefined();

  new MockGameObject({
    id: "my-system-tile-id",
    position: [10, 20, 30],
  });
  system.setSystemTileObjId("my-system-tile-id");

  expect(system.getLocalPosition(globalPosition)?.toString()).toBe(
    "(X=-9,Y=-18,Z=-27)"
  );
});

it("getGlobalPosition", () => {
  const params: SystemSchemaType = {
    tile: 1,
  };
  const system = new System(params);
  const localPosition = new Vector(1, 2, 3);
  expect(system.getGlobalPosition(localPosition)).toBeUndefined();

  new MockGameObject({
    id: "my-system-tile-id",
    position: [10, 20, 30],
  });
  system.setSystemTileObjId("my-system-tile-id");

  expect(system.getGlobalPosition(localPosition)?.toString()).toBe(
    "(X=11,Y=22,Z=33)"
  );
});

it("getSystemTileObj (valid)", () => {
  const params: SystemSchemaType = {
    tile: 1,
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
  };
  const system = new System(params);
  expect(system.getSystemTileObj()).toBeUndefined();

  system.setSystemTileObjId("no-such-id");
  expect(system.getSystemTileObj()).toBeUndefined();
});

it("attachment management", () => {
  const system = new System({
    tile: 1,
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
    img: "my-img",
    imgPackageId: "my-package-id",
  });
  expect(system.getImg()).toBe("my-img:my-package-id");
});

it("getImg (no package id)", () => {
  const system = new System({
    tile: 1,
    img: "my-img",
  });
  expect(system.getImg()).toBe(`my-img:${refPackageId}`);
});

it("getImg (none)", () => {
  const system = new System({
    tile: 1,
  });
  expect(system.getImg()).toBeUndefined();
});

it("getPlanets", () => {
  const system = new System({
    tile: 1,
    planets: [{ name: "planet-1" }, { name: "planet-2" }],
  });
  const attachment = new SystemAttachment({
    name: "attachment-1",
    nsid: "attachment-1-nsid",
    planets: [{ name: "planet-3" }],
  });
  system.addAttachment(attachment);

  expect(system.getPlanets().map((planet) => planet.getName())).toEqual([
    "planet-1",
    "planet-2",
    "planet-3",
  ]);
});

it("getWormholes_", () => {
  const system = new System({
    tile: 1,
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

it("getWormholesWithGlobalPosition", () => {
  const system = new System({
    tile: 1,
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

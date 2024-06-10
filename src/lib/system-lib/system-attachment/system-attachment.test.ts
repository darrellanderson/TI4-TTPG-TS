import { GameObject } from "@tabletop-playground/api";
import { SystemAttachment } from "./system-attachment";
import { MockGameObject } from "ttpg-mock";
import { WormholeWithGlobalPosition } from "../system/system";

it("constructor", () => {
  const attachment = new SystemAttachment({
    anomalies: ["asteroid_field"],
    img: "my-img",
    imgPackageId: "my-imgPackageId",
    name: "my-name",
    nsid: "my-nsid",
    planets: [],
    wormholes: ["alpha"],
    wormholesFaceDown: ["beta"],
  });
  expect(attachment.getAnomalies()).toEqual(["asteroid_field"]);
  expect(attachment.getImg()).toEqual("my-img:my-imgPackageId");
  expect(attachment.getName()).toEqual("my-name");
  expect(attachment.getNsid()).toEqual("my-nsid");
  expect(attachment.getPlanets()).toEqual([]);
  expect(attachment.getWormholes()).toEqual(["alpha"]);
  expect(attachment.isAttachmentFaceUp()).toEqual(true);
});

it("anomalies empty", () => {
  const attachment = new SystemAttachment({
    name: "my-name",
    nsid: "my-nsid",
  });
  expect(attachment.getAnomalies()).toEqual([]);
});

it("wormholes empty", () => {
  const attachment = new SystemAttachment({
    name: "my-name",
    nsid: "my-nsid",
  });
  expect(attachment.getWormholes()).toEqual([]);
});

it("wormholesFaceDown", () => {
  const attachment = new SystemAttachment({
    name: "my-name",
    nsid: "my-nsid",
    wormholes: ["alpha"],
    wormholesFaceDown: ["beta"],
  });
  expect(attachment.isAttachmentFaceUp()).toEqual(true);
  expect(attachment.getWormholes()).toEqual(["alpha"]);

  const obj: GameObject = new MockGameObject({
    id: "my-obj",
    rotation: [0, 0, 180],
  });
  attachment.setAttachmentObjId(obj.getId());
  expect(attachment.isAttachmentFaceUp()).toEqual(false);
  expect(attachment.getWormholes()).toEqual(["beta"]);

  obj.destroy();
  expect(attachment.isAttachmentFaceUp()).toEqual(true);
  expect(attachment.getWormholes()).toEqual(["alpha"]);
});

it("wormholesGlobalPosition", () => {
  const attachment = new SystemAttachment({
    name: "my-name",
    nsid: "my-nsid",
    wormholes: ["alpha"],
    wormholesFaceDown: ["beta"],
  });

  const obj: GameObject = new MockGameObject({
    rotation: [0, 0, 0],
  });
  attachment.setAttachmentObjId(obj.getId());

  const out: Array<WormholeWithGlobalPosition> =
    attachment.getWormholesWithGlobalPositions();

  const check = out.map((x) => `${x.wormhole}:${x.globalPosition.toString()}`);
  expect(check).toEqual(["alpha:(X=0,Y=0,Z=0)"]);
});

it("wormholesGlobalPosition (non-origin attachment)", () => {
  const attachment = new SystemAttachment({
    name: "my-name",
    nsid: "my-nsid",
    wormholes: ["alpha"],
    wormholesFaceDown: ["beta"],
  });

  const obj: GameObject = new MockGameObject({
    position: [1, 2, 3],
    rotation: [0, 0, 0],
  });
  attachment.setAttachmentObjId(obj.getId());

  const out: Array<WormholeWithGlobalPosition> =
    attachment.getWormholesWithGlobalPositions();

  const check = out.map((x) => `${x.wormhole}:${x.globalPosition.toString()}`);
  expect(check).toEqual(["alpha:(X=1,Y=2,Z=3)"]);
});

it("wormholesGlobalPosition face down", () => {
  const attachment = new SystemAttachment({
    name: "my-name",
    nsid: "my-nsid",
    wormholes: ["alpha"],
    wormholesFaceDown: ["beta"],
  });

  const obj: GameObject = new MockGameObject({
    rotation: [0, 0, 180],
  });
  attachment.setAttachmentObjId(obj.getId());

  const out: Array<WormholeWithGlobalPosition> =
    attachment.getWormholesWithGlobalPositions();

  const check = out.map((x) => `${x.wormhole}:${x.globalPosition.toString()}`);
  expect(check).toEqual(["beta:(X=0,Y=0,Z=0)"]);
});

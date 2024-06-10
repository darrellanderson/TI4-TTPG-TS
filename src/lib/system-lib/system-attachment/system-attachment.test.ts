import { GameObject } from "@tabletop-playground/api";
import { SystemAttachment } from "./system-attachment";
import { MockGameObject } from "ttpg-mock";

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
    rotation: [0, 0, 180],
  });
  attachment.setAttachmentObjId(obj.getId());
  expect(attachment.isAttachmentFaceUp()).toEqual(false);
  expect(attachment.getWormholes()).toEqual(["beta"]);

  obj.destroy();
  expect(attachment.isAttachmentFaceUp()).toEqual(true);
  expect(attachment.getWormholes()).toEqual(["alpha"]);
});

import { GameObject, refPackageId } from "@tabletop-playground/api";
import { SystemAttachment } from "./system-attachment";
import { MockGameObject } from "ttpg-mock";
import { WormholeWithGlobalPosition } from "../system/system";

it("constructor", () => {
  const attachment = new SystemAttachment(
    {
      anomalies: ["asteroid_field"],
      img: "my-img",
      imgPackageId: "my-imgPackageId",
      name: "my-name",
      nsidName: "my-nsid-name",
      planets: [],
      wormholes: ["alpha"],
      wormholesFaceDown: ["beta"],
    },
    "my-source"
  );
  expect(attachment.getAnomalies()).toEqual(["asteroid_field"]);
  expect(attachment.getImg()).toEqual("my-img:my-imgPackageId");
  expect(attachment.getName()).toEqual("my-name");
  expect(attachment.getNsid()).toEqual(
    "token.attachment:my-source/my-nsid-name"
  );
  expect(attachment.getPlanets()).toEqual([]);
  expect(attachment.getWormholes()).toEqual(["alpha"]);
  expect(attachment.isAttachmentFaceUp()).toEqual(true);
});

it("constructor (invalid params)", () => {
  expect(() => {
    new SystemAttachment(
      {
        name: "",
        nsidName: "@@invalid??",
      },
      "my-source"
    );
  }).toThrow();
});

it("anomalies empty", () => {
  const attachment = new SystemAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    },
    "my-source"
  );
  expect(attachment.getAnomalies()).toEqual([]);
});

it("img empty", () => {
  const attachment = new SystemAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    },
    "my-source"
  );
  expect(attachment.getImg()).toBeUndefined();
});

it("img no package id", () => {
  const attachment = new SystemAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      img: "my-img",
    },
    "my-source"
  );

  expect(attachment.getImg()).toBe(`my-img:${refPackageId}`);
});

it("planets", () => {
  const attachment = new SystemAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      planets: [
        {
          name: "my-planet-name",
          nsidName: "my-planet-nsid",
        },
      ],
    },
    "my-source"
  );
  expect(attachment.getPlanets().length).toEqual(1);
  expect(attachment.getPlanets()[0].getName()).toEqual("my-planet-name");
});

it("wormholes empty", () => {
  const attachment = new SystemAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    },
    "my-source"
  );
  expect(attachment.getWormholes()).toEqual([]);
});

it("wormholesFaceDown", () => {
  const attachment = new SystemAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      wormholes: ["alpha"],
      wormholesFaceDown: ["beta"],
    },
    "my-source"
  );
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
  const attachment = new SystemAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      wormholes: ["alpha"],
      wormholesFaceDown: ["beta"],
    },
    "my-source"
  );

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
  const attachment = new SystemAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      wormholes: ["alpha"],
      wormholesFaceDown: ["beta"],
    },
    "my-source"
  );

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
  const attachment = new SystemAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      wormholes: ["alpha"],
      wormholesFaceDown: ["beta"],
    },
    "my-source"
  );

  let out: Array<WormholeWithGlobalPosition>;
  let summary: Array<string>;

  // System tile obj not linked yet, uses origin and face-up.
  out = attachment.getWormholesWithGlobalPositions();
  summary = out.map((x) => `${x.wormhole}:${x.globalPosition.toString()}`);
  expect(summary).toEqual(["alpha:(X=0,Y=0,Z=0)"]);

  // Link system tile obj.
  const obj: GameObject = new MockGameObject({
    position: [1, 2, 3],
    rotation: [0, 0, 180],
  });
  attachment.setAttachmentObjId(obj.getId());

  out = attachment.getWormholesWithGlobalPositions();
  summary = out.map((x) => `${x.wormhole}:${x.globalPosition.toString()}`);
  expect(summary).toEqual(["beta:(X=1,Y=2,Z=3)"]);
});

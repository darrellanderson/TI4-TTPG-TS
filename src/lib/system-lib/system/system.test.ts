import { MockGameObject } from "ttpg-mock";
import { System, WormholeWithGlobalPosition } from "./system";
import { GameObject, Vector, refPackageId } from "@tabletop-playground/api";
import { SystemSchemaType } from "../schema/system-schema";
import { SystemAttachment } from "../system-attachment/system-attachment";
import { Planet } from "../planet/planet";

it("static nsidToSystemTileNumber", () => {
  expect(System.nsidToSystemTileNumber("tile.system:my-source/1")).toBe(1);
});

it("static nsidToSystemTileNumber (invalid prefix)", () => {
  expect(System.nsidToSystemTileNumber("invalid-prefix")).toBeUndefined();
});

it("static nsidToSystemTileNumber (good prefix, nsid parse fail)", () => {
  expect(System.nsidToSystemTileNumber("tile.system:@@@@")).toBeUndefined();
});

it("static nsidToSystemTileNumber (name not a number)", () => {
  expect(System.nsidToSystemTileNumber("tile.system:base/")).toBeUndefined();
});

it("static nsidToSystemTileNumber (name not a number)", () => {
  expect(System.nsidToSystemTileNumber("tile.system:base/x")).toBeUndefined();
});

it("constructor", () => {
  const params: SystemSchemaType = {
    tile: 1,
  };
  const system = new System(params, "my-source");
  expect(system.getSystemTileNumber()).toBe(1);
});

it("constructor (invalid params)", () => {
  const params: SystemSchemaType = {
    tile: 1,
    planets: [{ name: "", nsidName: "@@invalid??" }],
  };
  expect(() => {
    new System(params, "my-source");
  }).toThrow();
});

it("setSystemTileObjId", () => {
  const params: SystemSchemaType = {
    tile: 1,
  };
  const system = new System(params, "my-source");
  expect(system.getSystemTileObjId()).toBeUndefined();

  system.setSystemTileObjId("my-id");
  expect(system.getSystemTileObjId()).toBe("my-id");
});

it("worldPositionToLocal", () => {
  const params: SystemSchemaType = {
    tile: 1,
  };
  const system = new System(params, "my-source");
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
  };
  const system = new System(params, "my-source");
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

it("getSource", () => {
  const params: SystemSchemaType = {
    tile: 1,
  };
  const system = new System(params, "my-source");
  expect(system.getSource()).toBe("my-source");
});

it("getSystemTileNsid", () => {
  const params: SystemSchemaType = {
    tile: 1,
  };
  const system = new System(params, "my-source");
  expect(system.getSystemTileNsid()).toBe("tile.system:my-source/1");
});

it("getSystemTileObj (valid)", () => {
  const params: SystemSchemaType = {
    tile: 1,
  };
  const system = new System(params, "my-source");
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
  const system = new System(params, "my-source");
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
  const system = new System(params, "my-source");
  expect(system.getSystemTileObj()).toBeUndefined();

  system.setSystemTileObjId("no-such-id");
  expect(system.getSystemTileObj()).toBeUndefined();
});

it("attachment management", () => {
  const system = new System(
    {
      tile: 1,
    },
    "my-source"
  );
  const attachment1 = new SystemAttachment(
    {
      name: "my-name",
      nsidName: "my-attachment-nsid-name-1",
    },
    "my-source"
  );
  const attachment2 = new SystemAttachment(
    {
      name: "my-name",
      nsidName: "my-attachment-nsid-name-2",
    },
    "my-source"
  );
  const attachmentNsid1: string = attachment1.getNsid();
  const attachmentNsid2: string = attachment2.getNsid();
  const attachmentTokenObj1 = new MockGameObject({
    id: "token-1",
    templateMetadata: attachmentNsid1,
  });

  expect(system.hasAttachment(attachmentNsid1)).toBe(false);
  expect(system.hasAttachment(attachmentNsid1, "token-1")).toBe(false);
  expect(system.hasAttachment(attachmentNsid2)).toBe(false);

  system.addAttachment(attachment1);
  expect(system.hasAttachment(attachmentNsid1)).toBe(true); // new
  expect(system.hasAttachment(attachmentNsid1, "token-1")).toBe(false);
  expect(system.hasAttachment(attachmentNsid2)).toBe(false);

  attachment1.setAttachmentObjId("token-1");
  expect(system.hasAttachment(attachmentNsid1)).toBe(true);
  expect(system.hasAttachment(attachmentNsid1, "token-1")).toBe(true); // new
  expect(system.hasAttachment(attachmentNsid2)).toBe(false);

  attachmentTokenObj1.destroy();
  expect(system.hasAttachment(attachmentNsid1)).toBe(true); // did not ask about object
  expect(system.hasAttachment(attachmentNsid1, "token-1")).toBe(false); // new
  expect(system.hasAttachment(attachmentNsid2)).toBe(false);

  system.delAttachment(attachmentNsid1);
  expect(system.hasAttachment(attachmentNsid1)).toBe(false); // new
  expect(system.hasAttachment(attachmentNsid1, "token-1")).toBe(false);
  expect(system.hasAttachment(attachmentNsid2)).toBe(false);
});

it("getAnomalies", () => {
  const system = new System(
    {
      tile: 1,
      anomalies: ["asteroid_field"],
    },
    "my-source"
  );
  const attachment = new SystemAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      anomalies: ["gravity_rift"],
    },
    "my-source"
  );
  system.addAttachment(attachment);
  expect(system.getAnomalies()).toEqual(["asteroid_field", "gravity_rift"]);
});

it("getImg", () => {
  const system = new System(
    {
      tile: 1,
      imgPackageId: "my-package-id",
    },
    "my-source"
  );
  expect(system.getImg()).toBe(
    "tile/system/my-source/tile-001.png:my-package-id"
  );
});

it("getImg (face down)", () => {
  const system = new System(
    {
      tile: 1,
      imgFaceDown: true,
      imgPackageId: "my-package-id",
    },
    "my-source"
  );
  const systemTile: GameObject = new MockGameObject({
    rotation: [0, 0, 180],
  });
  system.setSystemTileObjId(systemTile.getId());
  expect(system.getImg()).toBe(
    "tile/system/my-source/tile-001.back.png:my-package-id"
  );
});

it("getImg (no package id)", () => {
  const system = new System(
    {
      tile: 1,
    },
    "my-source"
  );
  expect(system.getImg()).toBe(
    `tile/system/my-source/tile-001.png:${refPackageId}`
  );
});

it("getImg (homebrew)", () => {
  const system = new System(
    {
      tile: 1,
    },
    "homebrew-x"
  );
  expect(system.getImg()).toBe(
    `homebrew-x/tile/system/tile-001.png:${refPackageId}`
  );
});

it("getPlanetClosest", () => {
  const system = new System(
    {
      tile: 1,
      planets: [{ name: "planet-1", nsidName: "my-nsid-name" }],
    },
    "my-source"
  );
  let planet: Planet | undefined;

  // No system tile obj.
  planet = system.getPlanetClosest(new Vector(0, 0, 0));
  expect(planet).toBeUndefined();

  // With system tile obj.
  const systemTile: GameObject = new MockGameObject();
  system.setSystemTileObjId(systemTile.getId()); // must have a tile
  planet = system.getPlanetClosest(new Vector(0, 0, 0));
  expect(planet?.getName()).toBe("planet-1");

  // Further.
  planet = system.getPlanetClosest(new Vector(1000, 0, 0));
  expect(planet?.getName()).toBe("planet-1");
});

it("getPlanetClosest (no planets)", () => {
  const system = new System(
    {
      tile: 1,
    },
    "my-source"
  );
  const systemTile: GameObject = new MockGameObject();
  system.setSystemTileObjId(systemTile.getId()); // must have a tile
  expect(system.getPlanetClosest(new Vector(0, 0, 0))).toBeUndefined();
});

it("getPlanetExact", () => {
  const system = new System(
    {
      tile: 1,
      planets: [{ name: "planet-1", nsidName: "my-nsid-name" }],
    },
    "my-source"
  );
  let planet: Planet | undefined;

  // No system tile obj.
  planet = system.getPlanetExact(new Vector(0, 0, 0));
  expect(planet).toBeUndefined();

  // With system tile obj.
  const systemTile: GameObject = new MockGameObject();
  system.setSystemTileObjId(systemTile.getId()); // must have a tile
  planet = system.getPlanetExact(new Vector(0, 0, 0));
  expect(planet?.getName()).toBe("planet-1");

  // Further.
  planet = system.getPlanetExact(new Vector(1000, 0, 0));
  expect(planet?.getName()).toBeUndefined();
});

it("getPlanetClosest (no planets)", () => {
  const system = new System(
    {
      tile: 1,
    },
    "my-source"
  );
  const systemTile: GameObject = new MockGameObject();
  system.setSystemTileObjId(systemTile.getId()); // must have a tile
  expect(system.getPlanetExact(new Vector(0, 0, 0))).toBeUndefined();
});

it("getPlanets", () => {
  const system = new System(
    {
      tile: 1,
      planets: [
        { name: "planet-1", nsidName: "my-nsid-name-1" },
        { name: "planet-2", nsidName: "my-nsid-name-2" },
      ],
    },
    "my-source"
  );
  const attachment = new SystemAttachment(
    {
      name: "attachment-1",
      nsidName: "attachment-1-nsid",
      planets: [{ name: "planet-3", nsidName: "my-nsid-name" }],
    },
    "my-source"
  );
  system.addAttachment(attachment);
  expect(system.getPlanets().map((p) => p.getName())).toEqual([
    "planet-1",
    "planet-2",
    "planet-3",
  ]);
});

it("getSystemTileNumber", () => {
  const system = new System({ tile: 1 }, "my-source");
  expect(system.getSystemTileNumber()).toBe(1);
});

it("getWormholes", () => {
  const system = new System({ tile: 1, wormholes: ["alpha"] }, "my-source");
  const attachment = new SystemAttachment(
    {
      name: "attachment-1",
      nsidName: "attachment-1-nsid",
      wormholes: ["beta"],
    },
    "my-source"
  );
  system.addAttachment(attachment);

  expect(system.getWormholes()).toEqual(["alpha", "beta"]);
});

it("getWormholes face down", () => {
  const system = new System(
    {
      tile: 1,
      wormholesWithPositions: [
        { wormhole: "alpha", localPosition: { x: 1, y: 2 } },
      ],
      wormholesFaceDown: ["gamma"],
      wormholesWithPositionsFaceDown: [
        { wormhole: "delta", localPosition: { x: 1, y: 2 } },
      ],
    },
    "my-source"
  );
  const attachment = new SystemAttachment(
    {
      name: "attachment-1",
      nsidName: "attachment-1-nsid",
      wormholes: ["beta"],
    },
    "my-source"
  );
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
  const system = new System(
    {
      tile: 1,
      wormholes: ["alpha"],
    },
    "my-source"
  );
  const attachment = new SystemAttachment(
    {
      name: "attachment-1",
      nsidName: "attachment-1-nsid",
      wormholes: ["beta"],
    },
    "my-source"
  );
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
  const system = new System(
    {
      tile: 1,
      isHome: true,
    },
    "my-source"
  );
  expect(system.isHome()).toBe(true);
});

it("isHome (default)", () => {
  const system = new System(
    {
      tile: 1,
    },
    "my-source"
  );
  expect(system.isHome()).toBe(false);
});

it("isHyperlane", () => {
  const system = new System(
    {
      tile: 1,
      isHyperlane: true,
    },
    "my-source"
  );
  expect(system.isHyperlane()).toBe(true);
});

it("isHyperlane (default)", () => {
  const system = new System(
    {
      tile: 1,
    },
    "my-source"
  );
  expect(system.isHyperlane()).toBe(false);
});

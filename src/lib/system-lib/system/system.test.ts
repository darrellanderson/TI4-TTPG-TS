import { MockGameObject } from "ttpg-mock";
import { System, WormholeWithWorldPosition } from "./system";
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
  const obj: GameObject = new MockGameObject();
  const source: string = "my-source";
  const params: SystemSchemaType = {
    tile: 1,
  };
  const system = new System(obj, source, params);
  expect(system.getSystemTileNumber()).toBe(1);
});

it("constructor (invalid params)", () => {
  const obj: GameObject = new MockGameObject();
  const source: string = "my-source";
  const params: SystemSchemaType = {
    tile: 1,
    planets: [{ name: "", nsidName: "@@invalid??" }],
  };
  expect(() => {
    new System(obj, source, params);
  }).toThrow();
});

it("attachment management", () => {
  const system = new System(new MockGameObject(), "my-source", {
    tile: 1,
  });
  const attachment = new SystemAttachment(new MockGameObject(), "my-source", {
    name: "my-name",
    nsidName: "my-nsid-name",
  });
  expect(system.hasAttachment(attachment)).toBe(false);

  system.addAttachment(attachment);
  expect(system.hasAttachment(attachment)).toBe(true);

  let success: boolean = system.delAttachment(attachment);
  expect(success).toBe(true);
  expect(system.hasAttachment(attachment)).toBe(false);

  success = system.delAttachment(attachment);
  expect(success).toBe(false);
  expect(system.hasAttachment(attachment)).toBe(false);
});

it("getAnomalies", () => {
  const system = new System(new MockGameObject(), "my-source", {
    tile: 1,
    anomalies: ["asteroid-field"],
  });
  const attachment = new SystemAttachment(new MockGameObject(), "my-source", {
    name: "my-name",
    nsidName: "my-nsid-name",
    anomalies: ["gravity-rift"],
  });
  system.addAttachment(attachment);
  expect(system.getAnomalies()).toEqual(["asteroid-field", "gravity-rift"]);
});

it("getClass", () => {
  const system = new System(new MockGameObject(), "my-source", {
    tile: 1,
    class: "off-map",
  });
  expect(system.getClass()).toBe("off-map");
});

it("getClass (default)", () => {
  const system = new System(new MockGameObject(), "my-source", {
    tile: 1,
  });
  expect(system.getClass()).toBe("map");
});

it("getImg", () => {
  const system = new System(new MockGameObject(), "my-source", {
    tile: 1,
    imgPackageId: "my-package-id",
  });
  expect(system.getImg()).toBe(
    "tile/system/my-source/tile-001.png:my-package-id"
  );
});

it("getImg (face down)", () => {
  const system = new System(
    new MockGameObject({
      rotation: [0, 0, 180],
    }),
    "my-source",
    {
      tile: 1,
      imgFaceDown: true,
      imgPackageId: "my-package-id",
    }
  );
  expect(system.getImg()).toBe(
    "tile/system/my-source/tile-001.back.png:my-package-id"
  );
});

it("getImg (no package id)", () => {
  const system = new System(new MockGameObject(), "my-source", {
    tile: 1,
  });
  expect(system.getImg()).toBe(
    `tile/system/my-source/tile-001.png:${refPackageId}`
  );
});

it("getImg (homebrew)", () => {
  const system = new System(new MockGameObject(), "homebrew-x", {
    tile: 1,
  });
  expect(system.getImg()).toBe(
    `homebrew-x/tile/system/tile-001.png:${refPackageId}`
  );
});

it("getPlanetClosest", () => {
  const system = new System(new MockGameObject(), "my-source", {
    tile: 1,
    planets: [{ name: "planet-1", nsidName: "my-nsid-name" }],
  });
  let planet: Planet | undefined;

  planet = system.getPlanetClosest(new Vector(0, 0, 0));
  expect(planet?.getName()).toBe("planet-1");

  // Further.
  planet = system.getPlanetClosest(new Vector(1000, 0, 0));
  expect(planet?.getName()).toBe("planet-1");
});

it("getPlanetClosest (no planets)", () => {
  const system = new System(new MockGameObject(), "my-source", {
    tile: 1,
  });
  expect(system.getPlanetClosest(new Vector(0, 0, 0))).toBeUndefined();
});

it("getPlanetExact", () => {
  const system = new System(new MockGameObject(), "my-source", {
    tile: 1,
    planets: [{ name: "planet-1", nsidName: "my-nsid-name" }],
  });
  let planet: Planet | undefined;

  planet = system.getPlanetExact(new Vector(0, 0, 0));
  expect(planet?.getName()).toBe("planet-1");

  // Further.
  planet = system.getPlanetExact(new Vector(1000, 0, 0));
  expect(planet?.getName()).toBeUndefined();
});

it("getPlanetExact (no planets)", () => {
  const system = new System(new MockGameObject(), "my-source", {
    tile: 1,
  });
  expect(system.getPlanetExact(new Vector(0, 0, 0))).toBeUndefined();
});

it("getPlanets", () => {
  const system = new System(new MockGameObject(), "my-source", {
    tile: 1,
    planets: [
      { name: "planet-1", nsidName: "my-nsid-name-1" },
      { name: "planet-2", nsidName: "my-nsid-name-2" },
    ],
  });
  const attachment = new SystemAttachment(new MockGameObject(), "my-source", {
    name: "attachment-1",
    nsidName: "attachment-1-nsid",
    planets: [{ name: "planet-3", nsidName: "my-nsid-name" }],
  });
  system.addAttachment(attachment);
  expect(system.getPlanets().map((p) => p.getName())).toEqual([
    "planet-1",
    "planet-2",
    "planet-3",
  ]);
});

it("getSystemTileNumber", () => {
  const system = new System(new MockGameObject(), "my-source", { tile: 1 });
  expect(system.getSystemTileNumber()).toBe(1);
});

it("getWormholes", () => {
  const system = new System(new MockGameObject(), "my-source", {
    tile: 1,
    wormholes: ["alpha"],
  });
  const attachment = new SystemAttachment(new MockGameObject(), "my-source", {
    name: "attachment-1",
    nsidName: "attachment-1-nsid",
    wormholes: ["beta"],
  });
  system.addAttachment(attachment);
  expect(system.getWormholes()).toEqual(["alpha", "beta"]);
});

it("getWormholes face down", () => {
  const system = new System(
    new MockGameObject({ rotation: [0, 0, 180] }),
    "my-source",
    {
      tile: 1,
      wormholesWithPositions: [
        { wormhole: "alpha", localPosition: { x: 1, y: 2 } },
      ],
      wormholesFaceDown: ["gamma"],
      wormholesWithPositionsFaceDown: [
        { wormhole: "delta", localPosition: { x: 1, y: 2 } },
      ],
    }
  );
  const attachment = new SystemAttachment(new MockGameObject(), "my-source", {
    name: "attachment-1",
    nsidName: "attachment-1-nsid",
    wormholes: ["beta"],
  });
  system.addAttachment(attachment);
  expect(system.getWormholes()).toEqual(["gamma", "delta", "beta"]);
});

it("getWormholesWithGlobalPosition", () => {
  const system = new System(
    new MockGameObject({
      position: new Vector(10, 20, 30),
    }),
    "my-source",
    {
      tile: 1,
      wormholes: ["alpha"],
    }
  );
  const attachment = new SystemAttachment(
    new MockGameObject({ position: [1, 2, 3] }),
    "my-source",
    {
      name: "attachment-1",
      nsidName: "attachment-1-nsid",
      wormholes: ["beta"],
    }
  );
  system.addAttachment(attachment);
  const out: Array<WormholeWithWorldPosition> =
    system.getWormholesWithPositions();
  const summary: Array<string> = out.map(
    (w) => `${w.wormhole}:${w.globalPosition.toString()}`
  );
  expect(summary).toEqual(["alpha:(X=10,Y=20,Z=30)", "beta:(X=1,Y=2,Z=3)"]);

  // Link the attachment object.
});

it("isHome", () => {
  const system = new System(new MockGameObject(), "my-source", {
    tile: 1,
    isHome: true,
  });
  expect(system.isHome()).toBe(true);
});

it("isHome (default)", () => {
  const system = new System(new MockGameObject(), "my-source", {
    tile: 1,
  });
  expect(system.isHome()).toBe(false);
});

it("isHyperlane", () => {
  const system = new System(new MockGameObject(), "my-source", {
    tile: 1,
    isHyperlane: true,
  });
  expect(system.isHyperlane()).toBe(true);
});

it("isHyperlane (default)", () => {
  const system = new System(new MockGameObject(), "my-source", {
    tile: 1,
  });
  expect(system.isHyperlane()).toBe(false);
});

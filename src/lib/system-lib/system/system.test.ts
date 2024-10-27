import { GameObject, Player, Vector } from "@tabletop-playground/api";
import { MockGameObject, MockPlayer } from "ttpg-mock";

import { Planet } from "../planet/planet";
import { PlanetAttachment } from "../planet-attachment/planet-attachment";
import { SourceAndPackageIdSchemaType } from "../schema/basic-types-schema";
import { System, WormholeWithPosition } from "./system";
import { SystemAttachment } from "../system-attachment/system-attachment";
import { SystemDefaults } from "../data/system-defaults";
import { SystemSchemaType } from "../schema/system-schema";

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

it("static schemaToNsid", () => {
  expect(System.schemaToNsid("my-source", { tile: 1 })).toBe(
    "tile.system:my-source/1"
  );
});

it("static standardLocalPostion", () => {
  expect(System.standardLocalPosition(0, 2, false)).toEqual(
    SystemDefaults.PLANET_POS.POS_1_OF_2
  );
  expect(System.standardLocalPosition(0, 2, true)).toEqual(
    SystemDefaults.HOME_PLANET_POS.POS_1_OF_2
  );
  expect(() => {
    System.standardLocalPosition(1, 4, false); // invalid
  }).toThrow();
});

it("constructor", () => {
  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:my-source/1000",
  });
  const source: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  const params: SystemSchemaType = {
    tile: 1000,
  };
  const system = new System(systemTileObj, source, params);
  expect(system.getObj()).toBe(systemTileObj);
  expect(system.getSystemTileNumber()).toBe(1000);
  expect(system.getSource()).toEqual("my-source");
});

it("constructor (invalid params)", () => {
  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:my-source/1000",
  });
  const source: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  const params: SystemSchemaType = {
    tile: 1000,
    planets: [{ name: "ny-name", nsidName: "@@invalid??" }],
  };
  expect(() => {
    new System(systemTileObj, source, params);
  }).toThrow();
});

it("constructor (invalid nsid)", () => {
  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: "nope",
  });
  const source: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  const params: SystemSchemaType = {
    tile: 1,
  };
  expect(() => {
    new System(systemTileObj, source, params);
  }).toThrow('NSID mismatch: expected "tile.system:my-source/1", got "nope"');
});

it("onReleased", () => {
  const systemTileObj: MockGameObject = new MockGameObject({
    position: [0.1, 0.1, 0], // slightly off-hex position, will snap to hex
    templateMetadata: "tile.system:my-source/1000",
  });
  const system = new System(
    systemTileObj,
    { source: "my-source", packageId: "my-package-id" },
    { tile: 1000 }
  );
  const player: Player = new MockPlayer();
  systemTileObj._releaseAsPlayer(player, false);
  expect(systemTileObj.getPosition().toString()).toEqual("(X=0,Y=0,Z=0)");
  expect(system.getAttachments()).toEqual([]);
});

it("attachment management", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
    }
  );
  const attachment = new SystemAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.system:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    }
  );
  expect(system.hasAttachment(attachment)).toBe(false);
  expect(system.getAttachments()).toEqual([]);

  let success: boolean;
  success = system.addAttachment(attachment);
  expect(success).toBe(true);
  expect(system.hasAttachment(attachment)).toBe(true);
  expect(system.getAttachments()).toEqual([attachment]);

  success = system.addAttachment(attachment);
  expect(success).toBe(false); // already added
  expect(system.hasAttachment(attachment)).toBe(true);

  success = system.delAttachment(attachment);
  expect(success).toBe(true);
  expect(system.hasAttachment(attachment)).toBe(false);

  success = system.delAttachment(attachment);
  expect(success).toBe(false);
  expect(system.hasAttachment(attachment)).toBe(false);
});

it("getAnomalies", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
      anomalies: ["asteroid-field"],
    }
  );
  const attachment = new SystemAttachment(
    new MockGameObject({
      templateMetadata:
        "token.attachment.system:my-source/my-attachment-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-attachment-name",
      nsidName: "my-attachment-nsid-name",
      anomalies: ["gravity-rift"],
    }
  );
  system.addAttachment(attachment);
  expect(system.getAnomalies()).toEqual(["asteroid-field", "gravity-rift"]);
});

it("getClass", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
      class: "off-map",
    }
  );
  expect(system.getClass()).toBe("off-map");
});

it("getClass (default)", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
    }
  );
  expect(system.getClass()).toBe("map");
});

it("getHyperlanes", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
      hyperlanes: { n: ["s"] },
    }
  );
  expect(system.getHyperlanes()).toEqual({ n: ["s"] });
});
it("getHyperlanes (default)", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
    }
  );
  expect(system.getHyperlanes()).toEqual({});
});

it("getHyperlanes (face down)", () => {
  const system = new System(
    new MockGameObject({
      rotation: [0, 0, 180],
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
      hyperlanes: { n: ["s"] },
      hyperlanesFaceDown: { nw: ["se"] },
    }
  );
  expect(system.getHyperlanes()).toEqual({ nw: ["se"] });
});

it("getImg", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
    }
  );
  expect(system.getImg()).toBe("tile/system/tile-1000.png");
  expect(system.getImgPackageId()).toBe("my-package-id");
});

it("getImg (face down)", () => {
  const system = new System(
    new MockGameObject({
      rotation: [0, 0, 180],
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
      imgFaceDown: true,
    }
  );
  expect(system.getImg()).toBe("tile/system/tile-1000.back.png");
});

it("getImg (homebrew)", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:homebrew-x/1000" }),
    { source: "homebrew-x", packageId: "my-package-id" },
    {
      tile: 1000,
    }
  );
  expect(system.getImg()).toBe(`homebrew-x/tile/system/tile-1000.png`);
});

it("getName (empty)", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
      planets: [{ name: "my-planet", nsidName: "my-planet-nsid-name" }],
      wormholes: ["alpha"],
    }
  );
  expect(system.getName()).toBe("System 1000: my-planet, alpha");
});

it("getName (empty)", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
    }
  );
  expect(system.getName()).toBe("System 1000: <>");
});

it("getPlanetClosest", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
      planets: [{ name: "planet-1", nsidName: "my-nsid-name" }],
    }
  );
  let planet: Planet | undefined;

  planet = system.getPlanetClosest(new Vector(0, 0, 0));
  expect(planet?.getName()).toBe("planet-1");

  // Further.
  planet = system.getPlanetClosest(new Vector(1000, 0, 0));
  expect(planet?.getName()).toBe("planet-1");
});

it("getPlanetClosest (no planets)", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
    }
  );
  expect(system.getPlanetClosest(new Vector(0, 0, 0))).toBeUndefined();
});

it("getPlanetExact", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
      planets: [{ name: "planet-1", nsidName: "my-nsid-name" }],
    }
  );
  let planet: Planet | undefined;

  planet = system.getPlanetExact(new Vector(0, 0, 0));
  expect(planet?.getName()).toBe("planet-1");

  // Further.
  planet = system.getPlanetExact(new Vector(1000, 0, 0));
  expect(planet?.getName()).toBeUndefined();
});

it("getPlanetExact (no planets)", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
    }
  );
  expect(system.getPlanetExact(new Vector(0, 0, 0))).toBeUndefined();
});

it("getPlanets", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
      planets: [
        { name: "planet-1", nsidName: "my-nsid-name-1" },
        {
          name: "planet-2",
          nsidName: "my-nsid-name-2",
          localPosition: { x: 1, y: 2 },
        },
      ],
    }
  );
  const attachment = new SystemAttachment(
    new MockGameObject({
      templateMetadata:
        "token.attachment.system:my-source/my-attachment-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-attachment",
      nsidName: "my-attachment-nsid-name",
      planets: [{ name: "planet-3", nsidName: "my-nsid-name" }],
    }
  );
  system.addAttachment(attachment);
  let planets: Array<Planet> = system.getPlanets();
  expect(planets.map((p) => p.getName())).toEqual([
    "planet-1",
    "planet-2",
    "planet-3",
  ]);
  expect(planets[0]?.getPosition().toString()).toBe(
    SystemDefaults.PLANET_POS.POS_1_OF_2?.toString()
  );
  expect(planets[1]?.getPosition().toString()).toBe("(X=1,Y=2,Z=0)");

  // Destroy planet.
  const destroy: PlanetAttachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.planet:my-source/destroy",
    }),
    { source: "my-source", packageId: "my-package-id" },
    { name: "destroy", nsidName: "destroy", isDestroyPlanet: true }
  );
  const planet2: Planet | undefined = planets[1];
  if (planet2) {
    planet2.addAttachment(destroy);
  }
  planets = system.getPlanets();
  expect(planets.map((p) => p.getName())).toEqual(["planet-1", "planet-3"]);
});

it("getSystemTileNumber", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    { tile: 1000 }
  );
  expect(system.getSystemTileNumber()).toBe(1000);
});

it("getWormholes", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
      wormholes: ["alpha"],
    }
  );
  const attachment = new SystemAttachment(
    new MockGameObject({
      templateMetadata:
        "token.attachment.system:my-source/my-attachment-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-attachment",
      nsidName: "my-attachment-nsid-name",
      wormholes: ["beta"],
    }
  );
  system.addAttachment(attachment);
  expect(system.getWormholes()).toEqual(["alpha", "beta"]);
});

it("getWormholes face down", () => {
  const system = new System(
    new MockGameObject({
      rotation: [0, 0, 180],
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
      wormholesWithPositions: [
        { wormhole: "alpha", localPosition: { x: 1, y: 2 } },
      ],
      wormholesFaceDown: ["gamma"],
      wormholesWithPositionsFaceDown: [
        { wormhole: "delta", localPosition: { x: 1, y: 2 } },
      ],
    }
  );
  const attachment = new SystemAttachment(
    new MockGameObject({
      templateMetadata:
        "token.attachment.system:my-source/my-attachment-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-attachment",
      nsidName: "my-attachment-nsid-name",
      wormholes: ["beta"],
    }
  );
  system.addAttachment(attachment);
  expect(system.getWormholes()).toEqual(["gamma", "delta", "beta"]);
});

it("getWormholesWithPosition", () => {
  const system = new System(
    new MockGameObject({
      position: new Vector(10, 20, 30),
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
      wormholes: ["alpha"],
    }
  );
  const attachment = new SystemAttachment(
    new MockGameObject({
      position: [1, 2, 3],
      templateMetadata:
        "token.attachment.system:my-source/my-attachment-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-attachment",
      nsidName: "my-attachment-nsid-name",
      wormholes: ["beta"],
    }
  );
  system.addAttachment(attachment);
  let out: Array<WormholeWithPosition> = system.getWormholesWithPositions();
  let summary: Array<string> = out.map(
    (w) => `${w.wormhole}:${w.position.toString()}`
  );
  expect(summary).toEqual(["alpha:(X=10,Y=20,Z=30)", "beta:(X=1,Y=2,Z=3)"]);

  // Destroy wormhole attachment.
  const destroy: SystemAttachment = new SystemAttachment(
    new MockGameObject({
      position: [10, 20, 30],
      templateMetadata: "token.attachment.system:my-source/destroy",
    }),
    { source: "my-source", packageId: "my-package-id" },
    { name: "destroy", nsidName: "destroy", isDestroyWormhole: true }
  );
  system.addAttachment(destroy);
  out = system.getWormholesWithPositions();
  summary = out.map((w) => `${w.wormhole}:${w.position.toString()}`);
  expect(summary).toEqual(["beta:(X=1,Y=2,Z=3)"]);
});

it("isExcludeFromDraft", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    { tile: 1000, isExcludeFromDraft: true }
  );
  expect(system.isExcludeFromDraft()).toBe(true);
});

it("isHome", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
      isHome: true,
    }
  );
  expect(system.isHome()).toBe(true);
});

it("isHome (default)", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
    }
  );
  expect(system.isHome()).toBe(false);
});

it("isHyperlane", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
      isHyperlane: true,
    }
  );
  expect(system.isHyperlane()).toBe(true);
});

it("isHyperlane (default)", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
    }
  );
  expect(system.isHyperlane()).toBe(false);
});

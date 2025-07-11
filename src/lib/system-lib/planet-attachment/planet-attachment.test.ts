import { GameObject, Player, Vector } from "@tabletop-playground/api";
import { MockGameObject, MockPlayer } from "ttpg-mock";
import { PlanetAttachment } from "./planet-attachment";
import { System } from "../system/system";
import { Planet } from "../planet/planet";

it("static schemaToNsid", () => {
  expect(
    PlanetAttachment.schemaToNsid("my-source", {
      name: "my-name",
      nsidName: "my-nsid-name",
    })
  ).toBe("token.attachment.planet:my-source/my-nsid-name");
});

it("constructor", () => {
  const attachmentTokenObj = new MockGameObject({
    templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
  });
  const planetAttachment = new PlanetAttachment(
    attachmentTokenObj,
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    }
  );
  expect(planetAttachment.getName()).toBe("my-name");
  expect(planetAttachment.getObj()).toBe(attachmentTokenObj);
});

it("constructor (invalid params)", () => {
  expect(() => {
    new PlanetAttachment(
      new MockGameObject({
        templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
      }),
      { source: "my-source", packageId: "my-package-id" },
      {
        name: "my-name",
        nsidName: "@@invalid??",
      }
    );
  }).toThrow();
});

it("constructor (invalid nsid)", () => {
  expect(() => {
    new PlanetAttachment(
      new MockGameObject({ templateMetadata: "nope" }),
      { source: "my-source", packageId: "my-package-id" },
      {
        name: "my-name",
        nsidName: "invalid",
      }
    );
  }).toThrow(
    'NSID mismatch: expected "token.attachment.planet:my-source/invalid", got "nope"'
  );
});

it("attach/detach", () => {
  let onSystemChangedCound: number = 0;
  TI4.events.onSystemChanged.add(() => {
    onSystemChangedCound++;
  });

  const planetAttachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    }
  );

  let success: boolean = false;
  success = planetAttachment.attach();
  expect(success).toBe(false); // no planet
  expect(onSystemChangedCound).toBe(0);

  success = planetAttachment.detach();
  expect(success).toBe(false); // no planet
  expect(onSystemChangedCound).toBe(0);

  // Create system tile obj, TI4.systemRegistry picks it up.
  new MockGameObject({ templateMetadata: "tile.system:base/1" });
  const system: System | undefined = TI4.systemRegistry.getByPosition(
    new Vector(0, 0, 0)
  );
  expect(system).toBeDefined();
  if (!system) {
    throw new Error("system not found"); // for TypeScript
  }
  const planet: Planet | undefined = system.getPlanetClosest(
    new Vector(0, 0, 0)
  );
  expect(planet).toBeDefined();
  if (!planet) {
    throw new Error("planet not found"); // for TypeScript
  }
  expect(planet.hasAttachment(planetAttachment)).toBe(false);

  success = planetAttachment.attach();
  expect(success).toBe(true);
  expect(planet.hasAttachment(planetAttachment)).toBe(true);
  expect(onSystemChangedCound).toBe(1);

  success = planetAttachment.attach();
  expect(success).toBe(false); // already attached
  expect(planet.hasAttachment(planetAttachment)).toBe(true);
  expect(onSystemChangedCound).toBe(1);

  success = planetAttachment.detach();
  expect(success).toBe(true);
  expect(planet.hasAttachment(planetAttachment)).toBe(false);
  expect(onSystemChangedCound).toBe(2);

  success = planetAttachment.detach();
  expect(success).toBe(false); // already detached
  expect(planet.hasAttachment(planetAttachment)).toBe(false);
  expect(onSystemChangedCound).toBe(2);
});

it("flipIfPlanetHasTech", () => {
  const planetAttachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      flipIfNoPlanetTech: true,
    }
  );

  let systemTileObj: GameObject;
  let success: boolean;

  systemTileObj = new MockGameObject({
    templateMetadata: "tile.system:base/1",
  });

  success = planetAttachment.attach();
  expect(success).toBe(true);
  expect(planetAttachment.getObj().getRotation().toString()).toBe(
    "(P=0,Y=0,R=180)"
  );

  systemTileObj.destroy();
  systemTileObj = new MockGameObject({
    templateMetadata: "tile.system:base/19", // has tech
  });

  success = planetAttachment.attach();
  expect(success).toBe(true);
  expect(planetAttachment.getObj().getRotation().toString()).toBe(
    "(P=0,Y=0,R=0)"
  );
});

it("grab/release", () => {
  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:base/1",
  });
  const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
    systemTileObj.getId()
  );
  expect(system).toBeDefined();
  if (!system) {
    throw new Error("system not defined"); // for TypeScript
  }
  const planet: Planet | undefined = system.getPlanets()[0];
  expect(planet).toBeDefined();
  if (!planet) {
    throw new Error("planet not defined"); // for TypeScript
  }

  const attachmentTokenObj: MockGameObject = new MockGameObject({
    templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
  });
  const attachment = new PlanetAttachment(
    attachmentTokenObj,
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    }
  );

  const player: Player = new MockPlayer();

  expect(planet.hasAttachment(attachment)).toBe(false);
  attachmentTokenObj._releaseAsPlayer(player, false);
  expect(planet.hasAttachment(attachment)).toBe(true);
  attachmentTokenObj._grabAsPlayer(player);
  expect(planet.hasAttachment(attachment)).toBe(false);
});

it("img", () => {
  const attachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    }
  );
  expect(attachment.getImg()).toBe("token/attachment/planet/my-nsid-name.png");
  expect(attachment.getImgPackageId()).toBe("my-package-id");
});

it("img face down", () => {
  const attachment = new PlanetAttachment(
    new MockGameObject({
      rotation: [0, 0, 180],
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      imgFaceDown: true,
    }
  );
  expect(attachment.getImg()).toBe(
    "token/attachment/planet/my-nsid-name.back.png"
  );
});

it("img homebrew", () => {
  const attachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.planet:homebrew-x/my-nsid-name",
    }),
    { source: "homebrew-x", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    }
  );
  expect(attachment.getImg()).toBe(
    "homebrew-x/token/attachment/planet/my-nsid-name.png"
  );
});

it("getInfluence", () => {
  const planetAttachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      influence: 3,
    }
  );
  expect(planetAttachment.getInfluence()).toBe(3);
});

it("getInfluence (default)", () => {
  const planetAttachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    }
  );
  expect(planetAttachment.getInfluence()).toBe(0);
});

it("getInfluence (face down)", () => {
  const planetAttachment = new PlanetAttachment(
    new MockGameObject({
      rotation: [0, 0, 180],
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      influence: 3,
      influenceFaceDown: 5,
    }
  );
  expect(planetAttachment.getInfluence()).toBe(5);
});

it("getLegendaryCardNsid", () => {
  const planetAttachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },

    {
      name: "my-name",
      nsidName: "my-nsid-name",
      legendaryNsidName: "legendary-1",
    }
  );
  expect(planetAttachment.getLegendaryCardNsid()).toBe(
    "card.legendary-planet:my-source/legendary-1"
  );
});

it("getName", () => {
  const planetAttachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },

    {
      name: "my-name",
      nsidName: "my-nsid-name",
    }
  );
  expect(planetAttachment.getName()).toBe("my-name");
});

it("getNsidName", () => {
  const planetAttachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    }
  );
  expect(planetAttachment.getNsidName()).toBe("my-nsid-name");
});

it("getResources", () => {
  const planetAttachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },

    {
      name: "my-name",
      nsidName: "my-nsid-name",
      resources: 3,
    }
  );
  expect(planetAttachment.getResources()).toBe(3);
});

it("getResources (default)", () => {
  const planetAttachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    }
  );
  expect(planetAttachment.getResources()).toBe(0);
});

it("getResources (face down)", () => {
  const planetAttachment = new PlanetAttachment(
    new MockGameObject({
      rotation: [0, 0, 180],
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      resources: 3,
      resourcesFaceDown: 5,
    }
  );
  expect(planetAttachment.getResources()).toBe(5);
});

it("getTechs", () => {
  const planetAttachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      techs: ["blue", "red"],
    }
  );
  expect(planetAttachment.getTechs()).toEqual(["blue", "red"]);
});

it("getTechs (face down)", () => {
  const planetAttachment = new PlanetAttachment(
    new MockGameObject({
      rotation: [0, 0, 180],
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      techs: ["blue", "red"],
      techsFaceDown: ["yellow"],
    }
  );
  expect(planetAttachment.getTechs()).toEqual(["yellow"]);
});

it("getTraits", () => {
  const planetAttachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      traits: ["cultural", "industrial"],
    }
  );
  expect(planetAttachment.getTraits()).toEqual(["cultural", "industrial"]);
});

it("getTraits (face down)", () => {
  const planetAttachment = new PlanetAttachment(
    new MockGameObject({
      rotation: [0, 0, 180],
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      traits: ["cultural", "industrial"],
      traitsFaceDown: ["hazardous"],
    }
  );
  expect(planetAttachment.getTraits()).toEqual(["hazardous"]);
});

it("isDestroyPlanet", () => {
  const planetAttachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      isDestroyPlanet: true,
    }
  );
  expect(planetAttachment.isDestroyPlanet()).toBe(true);
});

it("isDestroyPlanet (default)", () => {
  const planetAttachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    }
  );
  expect(planetAttachment.isDestroyPlanet()).toBe(false);
});

it("isLegendary", () => {
  const planetAttachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      isLegendary: true,
    }
  );
  expect(planetAttachment.isLegendary()).toBe(true);
});

it("isLegendary (default)", () => {
  const planetAttachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },

    {
      name: "my-name",
      nsidName: "my-nsid-name",
    }
  );
  expect(planetAttachment.isLegendary()).toBe(false);
});

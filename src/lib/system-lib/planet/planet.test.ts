import { GameObject, Vector } from "@tabletop-playground/api";
import { MockGameObject } from "ttpg-mock";

import { PlanetSchemaType } from "../schema/planet-schema";
import { Planet } from "./planet";
import { PlanetAttachment } from "../planet-attachment/planet-attachment";
import { SystemDefaults } from "../data/system-defaults";

it("constructor", () => {
  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:my-source/1000",
  });
  const params: PlanetSchemaType = {
    name: "my-planet-name",
    nsidName: "my-planet-card-nsid",
  };
  const planet = new Planet(
    systemTileObj,
    { source: "my-source", packageId: "my-package-id" },
    params
  );
  expect(planet.getName()).toBe("my-planet-name");
  expect(planet.getObj()).toBe(systemTileObj);
});

it("constructor (invalid params)", () => {
  const params: PlanetSchemaType = {
    name: "my-planet-name",
    nsidName: "@@invalid??",
  };
  expect(() => {
    new Planet(
      new MockGameObject({
        templateMetadata: "tile.system:my-source/1000",
      }),
      { source: "my-source", packageId: "my-package-id" },
      params
    );
  }).toThrow();
});

it("constructor (invalid nsid)", () => {
  const params: PlanetSchemaType = {
    name: "my-planet-name",
    nsidName: "my-planet-nsid-name",
  };
  expect(() => {
    new Planet(
      new MockGameObject({
        templateMetadata: "not-a-system-tile-or-attachment",
      }),
      { source: "my-source", packageId: "my-package-id" },
      params
    );
  }).toThrow(
    'invalid object: "not-a-system-tile-or-attachment", expect either "tile.system:" or "token.attachment.system:" prefix'
  );
});

it("attachment management", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    }
  );
  const attachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata:
        "token.attachment.planet:my-source/my-attachment-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-attachment-name",
      nsidName: "my-attachment-nsid-name",
    }
  );
  let success: boolean = false;
  expect(planet.hasAttachment(attachment)).toEqual(false);
  expect(planet.getAttachments()).toEqual([]);

  success = planet.addAttachment(attachment);
  expect(success).toEqual(true);
  expect(planet.hasAttachment(attachment)).toEqual(true);
  expect(planet.getAttachments()).toEqual([attachment]);

  success = planet.addAttachment(attachment);
  expect(success).toEqual(false); // already added
  expect(planet.hasAttachment(attachment)).toEqual(true);

  success = planet.delAttachment(attachment);
  expect(success).toEqual(true);
  expect(planet.hasAttachment(attachment)).toEqual(false);

  success = planet.delAttachment(attachment);
  expect(success).toEqual(false); // already removed
  expect(planet.hasAttachment(attachment)).toEqual(false);
});

it("getInfluence", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
      influence: 2,
    }
  );
  const attachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata:
        "token.attachment.planet:my-source/my-attachment-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-attachment-name",
      nsidName: "my-attachment-nsid-name",
      influence: 3,
    }
  );
  planet.addAttachment(attachment);
  expect(planet.getInfluence()).toEqual(5);
});

it("getInfluence (default)", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    }
  );
  expect(planet.getInfluence()).toEqual(0);
});

it("getLegendarynsidNames", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
      legendaryNsidName: "my-planet-legendary-card-nsid",
    }
  );
  const attachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata:
        "token.attachment.planet:my-source/my-attachment-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-attachment-name",
      nsidName: "my-attachment-nsid-name",
      legendaryNsidName: "my-attachment-legendary-card-nsid",
    }
  );
  planet.addAttachment(attachment);
  expect(planet.getLegendaryCardNsids()).toEqual([
    "card.legendary_planet:my-source/my-planet-legendary-card-nsid",
    "card.legendary_planet:my-source/my-attachment-legendary-card-nsid",
  ]);
});

it("getLegendarynsidNames (default)", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    }
  );
  expect(planet.getLegendaryCardNsids()).toEqual([]);
});

it("getName", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    }
  );
  expect(planet.getName()).toEqual("my-planet-name");
});

it("getPlanetCardNsid", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid-name",
    }
  );
  expect(planet.getPlanetCardNsid()).toEqual(
    "card.planet:my-source/my-planet-card-nsid-name"
  );
});

it("getPosition", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
      localPosition: { x: 1, y: 2 },
    }
  );
  expect(planet.getPosition().toString()).toEqual("(X=1,Y=2,Z=0)");
});

it("getPosition (default)", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    }
  );
  expect(planet.getPosition().toString()).toEqual("(X=0,Y=0,Z=0)");
});

it("getRadius", () => {
  const planet = new Planet(
    new MockGameObject({
      scale: [3, 3, 3],
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
      radius: 2,
    }
  );
  expect(planet.getRadius()).toEqual(6);
});

it("getRadius (default)", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    }
  );
  expect(planet.getRadius()).toEqual(SystemDefaults.PLANET_RADIUS);
});

it("getResources", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
      resources: 2,
    }
  );
  const attachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata:
        "token.attachment.planet:my-source/my-attachment-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-attachment-name",
      nsidName: "my-attachment-nsid-name",
      resources: 3,
    }
  );
  planet.addAttachment(attachment);
  expect(planet.getResources()).toEqual(5);
});

it("getResources (default)", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    }
  );
  expect(planet.getResources()).toEqual(0);
});

it("getTechs", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
      techs: ["red"],
    }
  );
  const attachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata:
        "token.attachment.planet:my-source/my-attachment-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-attachment-name",
      nsidName: "my-attachment-nsid-name",
      techs: ["blue"],
    }
  );
  planet.addAttachment(attachment);
  expect(planet.getTechs()).toEqual(["red", "blue"]);
});

it("getTechs (default)", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "token.attachment.system:my-source/my-planet-card-nsid",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    }
  );
  expect(planet.getTechs()).toEqual([]);
});

it("getTraits", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
      traits: ["cultural"],
    }
  );
  const attachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata:
        "token.attachment.planet:my-source/my-attachment-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-attachment-name",
      nsidName: "my-attachment-nsid-name",
      traits: ["industrial"],
    }
  );
  planet.addAttachment(attachment);
  expect(planet.getTraits()).toEqual(["cultural", "industrial"]);
});

it("getTraits (default)", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    }
  );
  expect(planet.getTraits()).toEqual([]);
});

it("isDestroyedPlanet", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    }
  );
  const attachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata:
        "token.attachment.planet:my-source/my-attachment-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-attachment-name",
      nsidName: "my-attachment-nsid-name",
      isDestroyPlanet: true,
    }
  );
  planet.addAttachment(attachment);
  expect(planet.isDestroyedPlanet()).toEqual(true);
});

it("isDestroyedPlanet (default)", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    }
  );
  expect(planet.isDestroyedPlanet()).toEqual(false);
});

it("isLegendaryPlanet", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
      isLegendary: true,
    }
  );
  expect(planet.isLegendary()).toEqual(true);
});

it("isLegendaryPlanet (attachment)", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    }
  );
  const attachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata:
        "token.attachment.planet:my-source/my-attachment-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-attachment-name",
      nsidName: "my-attachment-nsid-name",
      isLegendary: true,
    }
  );
  planet.addAttachment(attachment);
  expect(planet.isLegendary()).toEqual(true);
});

it("isLegendaryPlanet (default)", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    }
  );
  expect(planet.isLegendary()).toEqual(false);
});

it("setLocalPosition", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    }
  );
  expect(planet.getPosition().toString()).toEqual("(X=0,Y=0,Z=0)");

  planet.setLocalPosition(new Vector(1, 2, 3));
  expect(planet.getPosition().toString()).toEqual("(X=1,Y=2,Z=3)");
});

it("localPositionFaceDown", () => {
  const planet = new Planet(
    new MockGameObject({
      templateMetadata: "tile.system:my-source/1000",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
      localPosition: { x: 1, y: 2 },
      localPositionFaceDown: { x: 3, y: 4 },
    }
  );
  expect(planet.getPosition().toString()).toEqual("(X=1,Y=2,Z=0)");

  planet.getObj().setRotation([0, 0, 180]);
  expect(planet.getPosition().toString()).toEqual("(X=3,Y=-4,Z=0)");
});

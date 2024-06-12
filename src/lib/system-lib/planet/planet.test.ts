import { PlanetSchemaType } from "../schema/planet-schema";
import { Planet } from "./planet";
import { PlanetAttachment } from "../planet-attachment/planet-attachment";
import { Vector } from "@tabletop-playground/api";
import { SystemDefaults } from "../data/system-defaults";

it("constructor", () => {
  const params: PlanetSchemaType = {
    name: "my-planet-name",
    nsidName: "my-planet-card-nsid",
  };
  const planet = new Planet(params, "my-source");
  expect(planet.getName()).toEqual("my-planet-name");
});

it("constructor (invalid params)", () => {
  const params: PlanetSchemaType = {
    name: "",
    nsidName: "@@invalid??",
  };
  expect(() => {
    new Planet(params, "my-source");
  }).toThrow();
});

it('constructor (invalid params")', () => {
  const params: PlanetSchemaType = {
    name: "",
    nsidName: "@@invalid??",
  };
  expect(() => {
    new Planet(params, "my-source");
  }).toThrow();
});

it("attachment management", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    },
    "my-source"
  );
  const attachment = new PlanetAttachment(
    {
      name: "my-attachment-name",
      nsidName: "my-attachment-nsid-name",
    },
    "my-source"
  );
  const attachmentNsid: string = attachment.getNsid();
  expect(planet.hasAttachment(attachmentNsid)).toEqual(false);
  planet.addAttachment(attachment);
  expect(planet.hasAttachment(attachmentNsid)).toEqual(true);
  planet.delAttachment(attachmentNsid);
  expect(planet.hasAttachment(attachmentNsid)).toEqual(false);
});

it("getInfluence", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
      influence: 2,
    },
    "my-source"
  );
  const attachment = new PlanetAttachment(
    {
      name: "my-attachment-name",
      nsidName: "my-attachment-nsid-name",
      influence: 3,
    },
    "my-source"
  );
  planet.addAttachment(attachment);
  expect(planet.getInfluence()).toEqual(5);
});

it("getInfluence (default)", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    },
    "my-source"
  );
  expect(planet.getInfluence()).toEqual(0);
});

it("getLegendarynsidNames", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
      legendaryNsidName: "my-planet-legendary-card-nsid",
    },
    "my-source"
  );
  const attachment = new PlanetAttachment(
    {
      name: "my-attachment-name",
      nsidName: "my-attachment-nsid-name",
      legendaryNsidName: "my-attachment-legendary-card-nsid",
    },
    "my-source"
  );
  planet.addAttachment(attachment);
  expect(planet.getLegendaryCardNsids()).toEqual([
    "card.legendary_planet:my-source/my-planet-legendary-card-nsid",
    "card.legendary_planet:my-source/my-attachment-legendary-card-nsid",
  ]);
});

it("getLegendarynsidNames (default)", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    },
    "my-source"
  );
  expect(planet.getLegendaryCardNsids()).toEqual([]);
});

it("getName", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    },
    "my-source"
  );
  expect(planet.getName()).toEqual("my-planet-name");
});

it("getLocalPosition", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    },
    "my-source"
  );
  expect(planet.getLocalPosition().toString()).toEqual("(X=0,Y=0,Z=0)");

  planet.setLocalPosition(new Vector(1, 2, 3));
  expect(planet.getLocalPosition().toString()).toEqual("(X=1,Y=2,Z=3)");
});

it("getPlanetCardNsid", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    },
    "my-source"
  );
  expect(planet.getPlanetCardNsid()).toEqual(
    "card.planet:my-source/my-planet-card-nsid"
  );
});

it("getRadius", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
      radius: 2,
    },
    "my-source"
  );
  expect(planet.getRadius()).toEqual(2);
});

it("getRadius (default)", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    },
    "my-source"
  );
  expect(planet.getRadius()).toEqual(SystemDefaults.PLANET_RADIUS);
});

it("getResources", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
      resources: 2,
    },
    "my-source"
  );
  const attachment = new PlanetAttachment(
    {
      name: "my-attachment-name",
      nsidName: "my-attachment-nsid-name",
      resources: 3,
    },
    "my-source"
  );
  planet.addAttachment(attachment);
  expect(planet.getResources()).toEqual(5);
});

it("getResources (default)", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    },
    "my-source"
  );
  expect(planet.getResources()).toEqual(0);
});

it("getTechs", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
      techs: ["red"],
    },
    "my-source"
  );
  const attachment = new PlanetAttachment(
    {
      name: "my-attachment-name",
      nsidName: "my-attachment-nsid-name",
      techs: ["blue"],
    },
    "my-source"
  );
  planet.addAttachment(attachment);
  expect(planet.getTechs()).toEqual(["red", "blue"]);
});

it("getTechs (default)", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    },
    "my-source"
  );
  expect(planet.getTechs()).toEqual([]);
});

it("getTraits", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
      traits: ["cultural"],
    },
    "my-source"
  );
  const attachment = new PlanetAttachment(
    {
      name: "my-attachment-name",
      nsidName: "my-attachment-nsid-name",
      traits: ["industrial"],
    },
    "my-source"
  );
  planet.addAttachment(attachment);
  expect(planet.getTraits()).toEqual(["cultural", "industrial"]);
});

it("getTraits (default)", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    },
    "my-source"
  );
  expect(planet.getTraits()).toEqual([]);
});

it("isDestroyedPlanet", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    },
    "my-source"
  );
  const attachment = new PlanetAttachment(
    {
      name: "my-attachment-name",
      nsidName: "my-attachment-nsid-name",
      isDestroyPlanet: true,
    },
    "my-source"
  );
  planet.addAttachment(attachment);
  expect(planet.isDestroyedPlanet()).toEqual(true);
});

it("isDestroyedPlanet (default)", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    },
    "my-source"
  );
  expect(planet.isDestroyedPlanet()).toEqual(false);
});

it("isLegendaryPlanet", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
      isLegendary: true,
    },
    "my-source"
  );
  expect(planet.isLegendary()).toEqual(true);
});

it("isLegendaryPlanet (attachment)", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    },
    "my-source"
  );
  const attachment = new PlanetAttachment(
    {
      name: "my-attachment-name",
      nsidName: "my-attachment-nsid-name",
      isLegendary: true,
    },
    "my-source"
  );
  planet.addAttachment(attachment);
  expect(planet.isLegendary()).toEqual(true);
});

it("isLegendaryPlanet (default)", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    },
    "my-source"
  );
  expect(planet.isLegendary()).toEqual(false);
});

it("setLocalPosition", () => {
  const planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    },
    "my-source"
  );
  expect(planet.getLocalPosition().toString()).toEqual("(X=0,Y=0,Z=0)");

  planet.setLocalPosition(new Vector(1, 2, 3));
  expect(planet.getLocalPosition().toString()).toEqual("(X=1,Y=2,Z=3)");
});

it("setLocalPositionFromStandard", () => {
  let planet = new Planet(
    {
      name: "my-planet-name",
      nsidName: "my-planet-card-nsid",
    },
    "my-source"
  );
  expect(planet.getLocalPosition().toString()).toEqual("(X=0,Y=0,Z=0)");

  let entityIndex: number = -1;
  let entityCount: number = -1;
  let isHome: boolean = false;
  let vs: string = "";

  expect(() => {
    planet.setLocalPositionFromStandard(entityIndex, entityCount, isHome);
  }).toThrow();

  entityIndex = 0;
  entityCount = 1;
  isHome = true;
  vs = SystemDefaults.HOME_PLANET_POS[`POS_1_OF_1`].toString();
  planet.setLocalPositionFromStandard(entityIndex, entityCount, isHome);
  expect(planet.getLocalPosition().toString()).toEqual(vs);

  entityIndex = 0;
  entityCount = 1;
  isHome = false;
  vs = SystemDefaults.PLANET_POS[`POS_1_OF_1`].toString();
  planet.setLocalPositionFromStandard(entityIndex, entityCount, isHome);
  expect(planet.getLocalPosition().toString()).toEqual(vs);
});

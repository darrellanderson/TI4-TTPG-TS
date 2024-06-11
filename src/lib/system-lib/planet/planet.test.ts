import { PlanetSchemaType } from "../schema/planet-schema";
import { Planet } from "./planet";
import { PlanetAttachment } from "../planet-attachment/planet-attachment";
import { Vector } from "@tabletop-playground/api";
import { SystemDefaults } from "../data/system-defaults";

it("constructor", () => {
  const params: PlanetSchemaType = {
    name: "my-planet-name",
  };
  const planet = new Planet(params);
  expect(planet.getName()).toEqual("my-planet-name");
});

it("attachment management", () => {
  const planet = new Planet({
    name: "my-planet-name",
  });
  const attachment = new PlanetAttachment({
    name: "my-attachment-name",
    nsid: "my-attachment-nsid",
  });
  planet.addAttachment(attachment);
  expect(planet.hasAttachment("my-attachment-nsid")).toEqual(true);
  planet.delAttachment("my-attachment-nsid");
  expect(planet.hasAttachment("my-attachment-nsid")).toEqual(false);
});

it("getInfluence", () => {
  const planet = new Planet({
    name: "my-planet-name",
    influence: 2,
  });
  const attachment = new PlanetAttachment({
    name: "my-attachment-name",
    nsid: "my-attachment-nsid",
    influence: 3,
  });
  planet.addAttachment(attachment);
  expect(planet.getInfluence()).toEqual(5);
});

it("getInfluence (default)", () => {
  const planet = new Planet({
    name: "my-planet-name",
  });
  expect(planet.getInfluence()).toEqual(0);
});

it("getLegendaryCardNsids", () => {
  const planet = new Planet({
    name: "my-planet-name",
    legendaryCardNsid: "my-planet-legendary-card-nsid",
  });
  const attachment = new PlanetAttachment({
    name: "my-attachment-name",
    nsid: "my-attachment-nsid",
    legendaryCardNsid: "my-attachment-legendary-card-nsid",
  });
  planet.addAttachment(attachment);
  expect(planet.getLegendaryCardNsids()).toEqual([
    "my-planet-legendary-card-nsid",
    "my-attachment-legendary-card-nsid",
  ]);
});

it("getLegendaryCardNsids (default)", () => {
  const planet = new Planet({
    name: "my-planet-name",
  });
  expect(planet.getLegendaryCardNsids()).toEqual([]);
});

it("getName", () => {
  const planet = new Planet({
    name: "my-planet-name",
  });
  expect(planet.getName()).toEqual("my-planet-name");
});

it("getLocalPosition", () => {
  const planet = new Planet({
    name: "my-planet-name",
  });
  expect(planet.getLocalPosition().toString()).toEqual("(X=0,Y=0,Z=0)");

  planet.setLocalPosition(new Vector(1, 2, 3));
  expect(planet.getLocalPosition().toString()).toEqual("(X=1,Y=2,Z=3)");
});

it("getRadius", () => {
  const planet = new Planet({
    name: "my-planet-name",
    radius: 2,
  });
  expect(planet.getRadius()).toEqual(2);
});

it("getRadius (default)", () => {
  const planet = new Planet({
    name: "my-planet-name",
  });
  expect(planet.getRadius()).toEqual(SystemDefaults.PLANET_RADIUS);
});

it("getResources", () => {
  const planet = new Planet({
    name: "my-planet-name",
    resources: 2,
  });
  const attachment = new PlanetAttachment({
    name: "my-attachment-name",
    nsid: "my-attachment-nsid",
    resources: 3,
  });
  planet.addAttachment(attachment);
  expect(planet.getResources()).toEqual(5);
});

it("getResources (default)", () => {
  const planet = new Planet({
    name: "my-planet-name",
  });
  expect(planet.getResources()).toEqual(0);
});

it("getTechs", () => {
  const planet = new Planet({
    name: "my-planet-name",
    techs: ["red"],
  });
  const attachment = new PlanetAttachment({
    name: "my-attachment-name",
    nsid: "my-attachment-nsid",
    techs: ["blue"],
  });
  planet.addAttachment(attachment);
  expect(planet.getTechs()).toEqual(["red", "blue"]);
});

it("getTechs (default)", () => {
  const planet = new Planet({
    name: "my-planet-name",
  });
  expect(planet.getTechs()).toEqual([]);
});

it("getTraits", () => {
  const planet = new Planet({
    name: "my-planet-name",
    traits: ["cultural"],
  });
  const attachment = new PlanetAttachment({
    name: "my-attachment-name",
    nsid: "my-attachment-nsid",
    traits: ["industrial"],
  });
  planet.addAttachment(attachment);
  expect(planet.getTraits()).toEqual(["cultural", "industrial"]);
});

it("getTraits (default)", () => {
  const planet = new Planet({
    name: "my-planet-name",
  });
  expect(planet.getTraits()).toEqual([]);
});

it("isDestroyedPlanet", () => {
  const planet = new Planet({
    name: "my-planet-name",
  });
  const attachment = new PlanetAttachment({
    name: "my-attachment-name",
    nsid: "my-attachment-nsid",
    isDestroyPlanet: true,
  });
  planet.addAttachment(attachment);
  expect(planet.isDestroyedPlanet()).toEqual(true);
});

it("isDestroyedPlanet (default)", () => {
  const planet = new Planet({
    name: "my-planet-name",
  });
  expect(planet.isDestroyedPlanet()).toEqual(false);
});

it("isLegendaryPlanet", () => {
  const planet = new Planet({
    name: "my-planet-name",
    isLegendary: true,
  });
  expect(planet.isLegendary()).toEqual(true);
});

it("isLegendaryPlanet (attachment)", () => {
  const planet = new Planet({
    name: "my-planet-name",
  });
  const attachment = new PlanetAttachment({
    name: "my-attachment-name",
    nsid: "my-attachment-nsid",
    isLegendary: true,
  });
  planet.addAttachment(attachment);
  expect(planet.isLegendary()).toEqual(true);
});

it("isLegendaryPlanet (default)", () => {
  const planet = new Planet({
    name: "my-planet-name",
  });
  expect(planet.isLegendary()).toEqual(false);
});

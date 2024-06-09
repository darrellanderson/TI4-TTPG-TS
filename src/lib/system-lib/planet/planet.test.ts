import { SystemDefaults } from "../data/system-defaults";
import { Planet } from "./planet";

it("constructor (required only)", () => {
  const planet = new Planet({
    name: "my-name",
  });
  expect(planet.getName()).toEqual("my-name");
  expect(planet.getRadius()).toEqual(SystemDefaults.PLANET_RADIUS);
  expect(planet.getLocalPosition().toString()).toEqual("(X=0,Y=0,Z=0)");
  expect(planet.getInfluence()).toEqual(0);
  expect(planet.getResources()).toEqual(0);
  expect(planet.getTechs()).toEqual([]);
  expect(planet.getTraits()).toEqual([]);
  expect(planet.isDestroyPlanet()).toEqual(false);
  expect(planet.isLegendary()).toEqual(false);
});

it("constructor (with optional)", () => {
  const planet = new Planet({
    name: "my-name",
    nsid: "my-nsid",
    position: {
      x: 1,
      y: 2,
    },
    radius: 5,
    influence: 3,
    resources: 4,
    traits: ["cultural"],
    techs: ["blue"],
    isLegendary: true,
    isDestroyPlanet: true,
  });
  expect(planet.getLocalPosition().toString()).toEqual("(X=1,Y=2,Z=0)");
  expect(planet.getRadius()).toEqual(5);
  expect(planet.getInfluence()).toEqual(3);
  expect(planet.getResources()).toEqual(4);
  expect(planet.getTechs()).toEqual(["blue"]);
  expect(planet.getTraits()).toEqual(["cultural"]);
  expect(planet.isDestroyPlanet()).toEqual(true);
  expect(planet.isLegendary()).toEqual(true);
});

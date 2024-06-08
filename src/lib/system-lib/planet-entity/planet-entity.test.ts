import { PlanetEntity } from "./planet-entity";

it("constructor (with optional)", () => {
  const planetEntity = new PlanetEntity({
    name: "my-name",
    type: "planet",
  });
  expect(planetEntity.getName()).toEqual("my-name");
  expect(planetEntity.getType()).toEqual("planet");
  expect(planetEntity.getNSID()).toBeUndefined();
  expect(planetEntity.getLocalPosition().toString()).toEqual("(X=0,Y=0,Z=0)");
  expect(planetEntity.getInfluence()).toEqual(0);
  expect(planetEntity.getResources()).toEqual(0);
  expect(planetEntity.getTraits()).toEqual([]);
  expect(planetEntity.getTechs()).toEqual([]);
  expect(planetEntity.isLegendary()).toEqual(false);
  expect(planetEntity.getRadius()).toBeUndefined();
  expect(planetEntity.isDestroyPlanet()).toEqual(false);
});

it("constructor (with optional)", () => {
  const planetEntity = new PlanetEntity({
    name: "my-name",
    type: "planet",
    nsid: "my-nsid",
    position: {
      x: 1,
      y: 2,
    },
    influence: 3,
    resources: 4,
    traits: ["cultural"],
    techs: ["blue"],
    legendary: true,
    radius: 5,
    destroyPlanet: true,
  });
  expect(planetEntity.getName()).toEqual("my-name");
  expect(planetEntity.getType()).toEqual("planet");
  expect(planetEntity.getNSID()).toEqual("my-nsid");
  expect(planetEntity.getLocalPosition().toString()).toEqual("(X=1,Y=2,Z=0)");
  expect(planetEntity.getInfluence()).toEqual(3);
  expect(planetEntity.getResources()).toEqual(4);
  expect(planetEntity.getTraits()).toEqual(["cultural"]);
  expect(planetEntity.getTechs()).toEqual(["blue"]);
  expect(planetEntity.isLegendary()).toEqual(true);
  expect(planetEntity.getRadius()).toEqual(5);
  expect(planetEntity.isDestroyPlanet()).toEqual(true);
});

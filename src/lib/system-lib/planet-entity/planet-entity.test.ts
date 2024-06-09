import { Vector } from "@tabletop-playground/api";
import { PlanetEntity } from "./planet-entity";

it("constructor (with optional)", () => {
  const planetEntity = new PlanetEntity({
    name: "my-name",
  });
  expect(planetEntity.getName()).toEqual("my-name");
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
    nsid: "my-nsid",
    position: {
      x: 1,
      y: 2,
    },
    radius: 5,
    influence: 3,
    resources: 4,
    techs: ["blue"],
    traits: ["cultural"],
    isLegendary: true,
    isDestroyPlanet: true,
    img: "my-img",
    imgPackageId: "my-img-package-id",
  });
  expect(planetEntity.getName()).toEqual("my-name");
  expect(planetEntity.getNSID()).toEqual("my-nsid");
  expect(planetEntity.getLocalPosition().toString()).toEqual("(X=1,Y=2,Z=0)");
  expect(planetEntity.getRadius()).toEqual(5);
  expect(planetEntity.getInfluence()).toEqual(3);
  expect(planetEntity.getResources()).toEqual(4);
  expect(planetEntity.getTechs()).toEqual(["blue"]);
  expect(planetEntity.getTraits()).toEqual(["cultural"]);
  expect(planetEntity.isLegendary()).toEqual(true);
  expect(planetEntity.isDestroyPlanet()).toEqual(true);
  expect(planetEntity.getImg()).toEqual("my-img");
  expect(planetEntity.getImgPackageId()).toEqual("my-img-package-id");
});

it("setLocalPosition", () => {
  const planetEntity = new PlanetEntity({
    name: "my-name",
  });
  expect(planetEntity.getLocalPosition().toString()).toEqual("(X=0,Y=0,Z=0)");

  planetEntity.setLocalPosition(new Vector(1, 2, 3));
  expect(planetEntity.getLocalPosition().toString()).toEqual("(X=1,Y=2,Z=3)");
});

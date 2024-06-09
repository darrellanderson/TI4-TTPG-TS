import { MockGameObject } from "ttpg-mock";
import { Vector } from "@tabletop-playground/api";
import { SystemEntity } from "./system-entity";
import { SystemEntityType } from "./system-entity-schema";

it("constructor/getters", () => {
  const params: SystemEntityType = {
    name: "my-name",
    nsid: "my-nsid",
    position: { x: 1, y: 2 },
    class: "map",
    tile: 3,
    isHome: true,
    isHyperlane: true,
    anomalies: ["asteroid-field"],
    wormholes: ["alpha"],
    img: "my-img",
    imgPackageId: "my-img-package-id",
  };
  const systemEntity = new SystemEntity(params);
  expect(systemEntity.getName()).toBe("my-name");
  expect(systemEntity.getNSID()).toBe("my-nsid");
  expect(systemEntity.getLocalPosition().toString()).toBe("(X=1,Y=2,Z=0)");
  expect(systemEntity.getClass()).toBe("map");
  expect(systemEntity.getTile()).toBe(3);
  expect(systemEntity.isHome()).toBe(true);
  expect(systemEntity.isHyperlane()).toBe(true);
  expect(systemEntity.getAnomalies()).toEqual(["asteroid-field"]);
  expect(systemEntity.getWormholes()).toEqual(["alpha"]);
  expect(systemEntity.getImg()).toBe("my-img");
  expect(systemEntity.getImgPackageId()).toBe("my-img-package-id");
});

it("setLocalPosition", () => {
  const params: SystemEntityType = {
    name: "my-name",
  };
  const systemEntity = new SystemEntity(params);
  expect(systemEntity.getLocalPosition().toString()).toBe("(X=0,Y=0,Z=0)");

  systemEntity.setLocalPosition(new Vector(3, 4, 5));
  expect(systemEntity.getLocalPosition().toString()).toBe("(X=3,Y=4,Z=5)");
});

it("planets", () => {
  const params: SystemEntityType = {
    name: "my-name",
    planets: [
      {
        name: "planet-1",
        position: { x: 1, y: 2 },
      },
      {
        name: "planet-2",
        position: { x: 3, y: 4 },
      },
    ],
  };
  const systemEntity = new SystemEntity(params);
  expect(systemEntity.getPlanetEntityTypes().length).toBe(2);
});

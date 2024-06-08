import { MockGameObject } from "ttpg-mock";
import { Vector } from "@tabletop-playground/api";
import { SystemEntity } from "./system-entity";
import { SystemEntityType } from "./system-entity-schema";

it("constructor/getters", () => {
  const params: SystemEntityType = {
    name: "my-name",
    nsid: "my-nsid",
    position: { x: 1, y: 2 },
  };
  const systemEntity = new SystemEntity(params);
  expect(systemEntity.getName()).toBe("my-name");
  expect(systemEntity.getNSID()).toBe("my-nsid");
  expect(systemEntity.getSystemTileObjId()).toBeUndefined();
  expect(systemEntity.getLocalPosition().toString()).toBe("(X=1,Y=2,Z=0)");
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

it("setSystemTileObjId", () => {
  const params: SystemEntityType = {
    name: "my-name",
  };
  const systemEntity = new SystemEntity(params);
  expect(systemEntity.getSystemTileObjId()).toBeUndefined();

  systemEntity.setSystemTileObjId("my-id");
  expect(systemEntity.getSystemTileObjId()).toBe("my-id");
});

it("getGlobalPosition", () => {
  const params: SystemEntityType = {
    name: "my-name",
    position: { x: 1, y: 2 },
  };
  const systemEntity = new SystemEntity(params);
  expect(systemEntity.getGlobalPosition()).toBeUndefined();

  const systemTileObj = new MockGameObject({
    id: "my-system-tile-id",
    position: [10, 20, 30],
  });
  systemEntity.setSystemTileObjId("my-system-tile-id");

  expect(systemEntity.getGlobalPosition()?.toString()).toBe("(X=11,Y=22,Z=30)");
});

it("getSystemTileObj (valid)", () => {
  const params: SystemEntityType = {
    name: "my-name",
  };
  const systemEntity = new SystemEntity(params);
  expect(systemEntity.getSystemTileObj()).toBeUndefined();

  const systemTileObj = new MockGameObject({
    id: "my-system-tile-id",
  });
  systemEntity.setSystemTileObjId("my-system-tile-id");
  expect(systemEntity.getSystemTileObj()).toBe(systemTileObj);
});

it("getSystemTileObj (invalid object)", () => {
  const params: SystemEntityType = {
    name: "my-name",
  };
  const systemEntity = new SystemEntity(params);
  expect(systemEntity.getSystemTileObj()).toBeUndefined();

  const systemTileObj = new MockGameObject({
    id: "my-system-tile-id",
  });
  systemEntity.setSystemTileObjId("my-system-tile-id");
  expect(systemEntity.getSystemTileObj()).toBe(systemTileObj);

  systemTileObj.destroy();
  expect(systemEntity.getSystemTileObj()).toBeUndefined();
});

it("getSystemTileObj (invalid id)", () => {
  const params: SystemEntityType = {
    name: "my-name",
  };
  const systemEntity = new SystemEntity(params);
  expect(systemEntity.getSystemTileObj()).toBeUndefined();

  systemEntity.setSystemTileObjId("no-such-id");
  expect(systemEntity.getSystemTileObj()).toBeUndefined();
});

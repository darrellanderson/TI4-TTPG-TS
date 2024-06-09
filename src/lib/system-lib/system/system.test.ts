import { MockGameObject } from "ttpg-mock";
import { SystemEntityType } from "../system-entity/system-entity-schema";
import { SystemEntity } from "../system-entity/system-entity";
import { System } from "./system";
import { Vector } from "@tabletop-playground/api";

it("setSystemTileObjId", () => {
  const params: SystemEntityType = {
    name: "my-name",
  };
  const systemEntity = new SystemEntity(params);
  const system = new System(systemEntity);
  expect(system.getSystemTileObjId()).toBeUndefined();

  system.setSystemTileObjId("my-id");
  expect(system.getSystemTileObjId()).toBe("my-id");
});

it("getGlobalPosition", () => {
  const params: SystemEntityType = {
    name: "my-name",
  };
  const systemEntity = new SystemEntity(params);
  const system = new System(systemEntity);
  const localPosition = new Vector(1, 2, 3);
  expect(system.getGlobalPosition(localPosition)).toBeUndefined();

  const systemTileObj = new MockGameObject({
    id: "my-system-tile-id",
    position: [10, 20, 30],
  });
  system.setSystemTileObjId("my-system-tile-id");

  expect(system.getGlobalPosition(localPosition)?.toString()).toBe(
    "(X=11,Y=22,Z=33)"
  );
});

it("getSystemTileObj (valid)", () => {
  const params: SystemEntityType = {
    name: "my-name",
  };
  const systemEntity = new SystemEntity(params);
  const system = new System(systemEntity);
  expect(system.getSystemTileObj()).toBeUndefined();

  const systemTileObj = new MockGameObject({
    id: "my-system-tile-id",
  });
  system.setSystemTileObjId("my-system-tile-id");
  expect(system.getSystemTileObj()).toBe(systemTileObj);
});

it("getSystemTileObj (invalid object)", () => {
  const params: SystemEntityType = {
    name: "my-name",
  };
  const systemEntity = new SystemEntity(params);
  const system = new System(systemEntity);
  expect(system.getSystemTileObj()).toBeUndefined();

  const systemTileObj = new MockGameObject({
    id: "my-system-tile-id",
  });
  system.setSystemTileObjId("my-system-tile-id");
  expect(system.getSystemTileObj()).toBe(systemTileObj);

  systemTileObj.destroy();
  expect(system.getSystemTileObj()).toBeUndefined();
});

it("getSystemTileObj (invalid id)", () => {
  const params: SystemEntityType = {
    name: "my-name",
  };
  const systemEntity = new SystemEntity(params);
  const system = new System(systemEntity);
  expect(system.getSystemTileObj()).toBeUndefined();

  system.setSystemTileObjId("no-such-id");
  expect(system.getSystemTileObj()).toBeUndefined();
});

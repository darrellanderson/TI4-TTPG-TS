import { Container, GameObject, Rotator } from "@tabletop-playground/api";
import { MockContainer, MockGameObject, Vector } from "ttpg-mock";

import { MapStringEntry } from "./map-string-parser";
import { MapStringLoad } from "./map-string-load";
import { System } from "../../system-lib/system/system";

it("constructor", () => {
  new MapStringLoad();
});

it("_parseAndValidateMapString", () => {
  const entries: Array<MapStringEntry> | undefined =
    new MapStringLoad()._parseAndValidateMapString("{1}");
  expect(entries).toEqual([{ tile: 1 }]);
});

it("_parseAndValidateMapString (invalid)", () => {
  const entries: Array<MapStringEntry> | undefined =
    new MapStringLoad()._parseAndValidateMapString("@");
  expect(entries).toBeUndefined();
});

it("_validateSystems", () => {
  const entries: Array<MapStringEntry> = [{ tile: 1 }];
  expect(new MapStringLoad()._validateSystems(entries)).toBe(true);
});

it("_validateSystems (unknown tile number)", () => {
  const entries: Array<MapStringEntry> = [{ tile: 4398 }];
  expect(new MapStringLoad()._validateSystems(entries)).toBe(false);
});

it("_tryMoveExistingSystemTileObj (existing system)", () => {
  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:base/1",
  });
  expect(systemTileObj.getPosition().toString()).toBe("(X=0,Y=0,Z=0)");
  expect(systemTileObj.getRotation().toString()).toBe("(P=0,Y=0,R=0)");

  const load: MapStringLoad = new MapStringLoad();
  const pos: Vector = new Vector(1, 2, 3);
  const rot: Rotator = new Rotator(4, 5, 6);
  const systemsSnapshot: Map<
    number,
    Array<System>
  > = load._getTileNumberToSystemsSnapshot();
  expect(systemsSnapshot.get(1)).toBeDefined();

  const placed: GameObject | undefined = load._tryMoveExistingSystemTileObj(
    1,
    pos,
    rot,
    systemsSnapshot
  );
  expect(placed).toBeDefined();
  expect(systemTileObj.getPosition().toString()).toBe("(X=1,Y=2,Z=0)");
  expect(systemTileObj.getRotation().toString()).toBe("(P=4,Y=5,R=6)");
});

it("_tryMoveExistingSystemTileObj (existing system in container)", () => {
  const container: Container = new MockContainer();
  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:base/1",
  });
  container.addObjects([systemTileObj]);
  expect(container.getItems().includes(systemTileObj)).toBe(true);
  expect(systemTileObj.getContainer()).toEqual(container);

  const load: MapStringLoad = new MapStringLoad();
  const pos: Vector = new Vector(1, 2, 3);
  const rot: Rotator = new Rotator(4, 5, 6);
  const systemsSnapshot: Map<
    number,
    Array<System>
  > = load._getTileNumberToSystemsSnapshot();

  expect(systemsSnapshot.get(1)).toBeDefined();

  const placed: GameObject | undefined = load._tryMoveExistingSystemTileObj(
    1,
    pos,
    rot,
    systemsSnapshot
  );
  expect(placed).toBeDefined();
  expect(container.getItems().includes(systemTileObj)).toBe(false);
  expect(systemTileObj.getContainer()).toBeUndefined();
  expect(systemTileObj.getPosition().toString()).toBe("(X=1,Y=2,Z=0)");
  expect(systemTileObj.getRotation().toString()).toBe("(P=4,Y=5,R=6)");
});

it("_tryMoveExistingSystemTileObj (container take failure)", () => {
  const container: Container = new MockContainer();
  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:base/1",
  });
  container.addObjects([systemTileObj]);
  expect(container.getItems().includes(systemTileObj)).toBe(true);
  expect(systemTileObj.getContainer()).toEqual(container);

  const load: MapStringLoad = new MapStringLoad();
  const pos: Vector = new Vector(1, 2, 3);
  const rot: Rotator = new Rotator(4, 5, 6);
  const systemsSnapshot: Map<
    number,
    Array<System>
  > = load._getTileNumberToSystemsSnapshot();

  expect(systemsSnapshot.get(1)).toBeDefined();

  // Fail the container take.
  jest.spyOn(container, "take").mockReturnValue(false);

  const placed: GameObject | undefined = load._tryMoveExistingSystemTileObj(
    1,
    pos,
    rot,
    systemsSnapshot
  );
  expect(placed).toBeUndefined();
});

it("_tryMoveExistingSystemTileObj (missing system array)", () => {
  const load: MapStringLoad = new MapStringLoad();
  const pos: Vector = new Vector(1, 2, 3);
  const rot: Rotator = new Rotator(4, 5, 6);
  const systemsSnapshot: Map<
    number,
    Array<System>
  > = load._getTileNumberToSystemsSnapshot();
  expect(systemsSnapshot.get(1)).toBeUndefined();

  const placed: GameObject | undefined = load._tryMoveExistingSystemTileObj(
    1,
    pos,
    rot,
    systemsSnapshot
  );
  expect(placed).toBeUndefined();
});

it("_tryMoveExistingSystemTileObj (empty system array)", () => {
  new MockGameObject({
    templateMetadata: "tile.system:base/1",
  });

  const load: MapStringLoad = new MapStringLoad();
  const pos: Vector = new Vector(1, 2, 3);
  const rot: Rotator = new Rotator(4, 5, 6);
  const systemsSnapshot: Map<
    number,
    Array<System>
  > = load._getTileNumberToSystemsSnapshot();
  expect(systemsSnapshot.get(1)).toBeDefined();

  // Remove the system from the snapshot.
  systemsSnapshot.get(1)?.pop();
  expect(systemsSnapshot.get(1)?.length).toBe(0);

  const placed: GameObject | undefined = load._tryMoveExistingSystemTileObj(
    1,
    pos,
    rot,
    systemsSnapshot
  );
  expect(placed).toBeUndefined();
});

it("_trySpawnNewSystemTileObj (spawn)", () => {
  expect(
    globalThis.TI4.systemRegistry.tileNumberToSystemTileObjNsid(1)
  ).toBeDefined();
  expect(globalThis.TI4.spawn.has("tile.system:base/1")).toBe(true);
  expect(globalThis.TI4.systemRegistry.getAllSystemsWithObjs().length).toBe(0);

  const load: MapStringLoad = new MapStringLoad();
  const pos: Vector = new Vector(1, 2, 3);
  const rot: Rotator = new Rotator(4, 5, 6);
  const placed: GameObject | undefined = load._trySpawnNewSystemTileObj(
    1,
    pos,
    rot
  );
  expect(placed).toBeDefined();

  const systems: Array<System> =
    globalThis.TI4.systemRegistry.getAllSystemsWithObjs();
  expect(systems.length).toBe(1);
  const systemTileObj: GameObject | undefined = systems[0]?.getObj();
  expect(systemTileObj?.getTemplateMetadata()).toBe("tile.system:base/1");
  expect(systemTileObj?.getPosition().toString()).toBe("(X=1,Y=2,Z=0)"); // snap to ground
  expect(systemTileObj?.getRotation().toString()).toBe("(P=4,Y=5,R=6)");
});

it("_trySpawnNewSystemTileObj (unknown nsid)", () => {
  const load: MapStringLoad = new MapStringLoad();
  const pos: Vector = new Vector(1, 2, 3);
  const rot: Rotator = new Rotator(4, 5, 6);
  const placed: GameObject | undefined = load._trySpawnNewSystemTileObj(
    4398,
    pos,
    rot
  );
  expect(placed).toBeUndefined();
});

it("load", () => {
  MockGameObject.simple("token:base/custodians");
  const mapString: string = "{1}";
  const load: MapStringLoad = new MapStringLoad();
  expect(load.load(mapString)).toBe(true);
});

it("load (invalid map string)", () => {
  const mapString: string = "@@";
  const load: MapStringLoad = new MapStringLoad();
  expect(load.load(mapString)).toBe(false);
});

it("load (unknown tile number)", () => {
  const mapString: string = "{4398}";
  const load: MapStringLoad = new MapStringLoad();
  expect(load.load(mapString)).toBe(false);
});

it("load (existing system)", () => {
  new MockGameObject({
    templateMetadata: "tile.system:base/1",
  });
  const mapString: string = "{1}";
  const load: MapStringLoad = new MapStringLoad();
  expect(load.load(mapString)).toBe(true);
});

it("load (spawn)", () => {
  const mapString: string = "{1}";
  const load: MapStringLoad = new MapStringLoad();
  expect(load.load(mapString)).toBe(true);
});

it("load (spawn side/rot)", () => {
  const mapString: string = "{1B5}";
  const load: MapStringLoad = new MapStringLoad();
  expect(load.load(mapString)).toBe(true);
});

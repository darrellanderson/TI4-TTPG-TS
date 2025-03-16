import { Vector, Zone } from "@tabletop-playground/api";
import { OnObjectFellThroughTable } from "./on-object-fell-through-table";
import { MockGameObject, MockStaticObject } from "ttpg-mock";

// Global calls init, which creates the zone.  Destroy it for testing.
beforeEach(() => {
  const zone = new OnObjectFellThroughTable()._findOrCreateZone();
  zone.destroy();
});

it("constructor/init", () => {
  new OnObjectFellThroughTable().setRelocateTo(new Vector(0, 0, 0)).init();
});

it("constructor/init (with table and object below)", () => {
  new MockStaticObject({
    templateMetadata: "table:base/table",
    position: new Vector(1, 2, 3),
    _modelSize: new Vector(4, 5, 6),
  });
  new MockGameObject({
    position: new Vector(0, 0, 1), // below table
  });

  new OnObjectFellThroughTable().init();
});

it("_getTablePositionAndExtent", () => {
  new MockStaticObject({
    templateMetadata: "table:base/table",
    position: new Vector(1, 2, 3),
    _modelSize: new Vector(4, 5, 6),
  });

  const obj = new OnObjectFellThroughTable();
  const { tablePosition, tableExtent } = obj._getTablePositionAndExtent();
  expect(tablePosition).toBeInstanceOf(Vector);
  expect(tablePosition.toString()).toBe("(X=1,Y=2,Z=3)");
  expect(tableExtent).toBeInstanceOf(Vector);
  expect(tableExtent.toString()).toBe("(X=2,Y=2.5,Z=3)");
});

it("_getTablePositionAndExtent (no table)", () => {
  const obj = new OnObjectFellThroughTable();
  const { tablePosition, tableExtent } = obj._getTablePositionAndExtent();
  expect(tablePosition).toBeInstanceOf(Vector);
  expect(tablePosition.toString()).toBe("(X=0,Y=0,Z=0)");
  expect(tableExtent).toBeInstanceOf(Vector);
  expect(tableExtent.toString()).toBe("(X=0,Y=0,Z=0)");
});

it("_findOrCreateZone", () => {
  new MockStaticObject({
    templateMetadata: "table:base/table",
    position: new Vector(1, 2, 3),
    _modelSize: new Vector(4, 5, 6),
  });

  const obj = new OnObjectFellThroughTable();

  const { tablePosition, tableExtent } = obj._getTablePositionAndExtent();
  expect(tablePosition.toString()).toBe("(X=1,Y=2,Z=3)");
  expect(tableExtent.toString()).toBe("(X=2,Y=2.5,Z=3)");

  const zone: Zone = obj._findOrCreateZone();
  expect(zone).toBeDefined();
  expect(zone.getId()).toBe("__below_table__");
  expect(zone.getPosition().toString()).toBe("(X=0,Y=0,Z=2)");
  expect(zone.getScale().toString()).toBe("(X=4,Y=5,Z=6)");

  const again: Zone = obj._findOrCreateZone();
  expect(again).toEqual(zone); // found exisiting zone.
});

it("_findOrCreateZone (no table)", () => {
  const obj = new OnObjectFellThroughTable();
  const zone: Zone = obj._findOrCreateZone();
  expect(zone).toBeDefined();
  expect(zone.getId()).toBe("__below_table__");
  expect(zone.getPosition().toString()).toBe("(X=0,Y=0,Z=-1)");
  expect(zone.getScale().toString()).toBe("(X=0,Y=0,Z=0)");
});

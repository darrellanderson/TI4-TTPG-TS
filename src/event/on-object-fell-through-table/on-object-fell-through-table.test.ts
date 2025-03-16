import { Vector, Zone } from "@tabletop-playground/api";
import { OnObjectFellThroughTable } from "./on-object-fell-through-table";
import { MockGameObject, MockStaticObject } from "ttpg-mock";

// Global calls init, which creates the zone.  Destroy it for testing.
beforeEach(() => {
  OnObjectFellThroughTable.destroyZone();
});

it("constructor/init", () => {
  new OnObjectFellThroughTable().setRelocateTo(new Vector(0, 0, 0)).init();
});

it("constructor/init (with table and object below)", () => {
  new MockStaticObject({
    templateMetadata: "table:base/table",
    position: new Vector(1, 2, 3),
    _modelSize: new Vector(7, 8, 9),
  });
  new MockGameObject({
    position: new Vector(0, 0, 1), // below table
  });
  new MockGameObject({
    position: new Vector(0, 0, 0), // origin (special case for a "f"lip bug)
  });

  new OnObjectFellThroughTable().init();
});

it("_getTablePositionAndExtent", () => {
  new MockStaticObject({
    templateMetadata: "table:base/table",
    position: new Vector(1, 2, 3),
    _modelSize: new Vector(7, 8, 9),
  });

  const { tablePosition, tableExtent } =
    OnObjectFellThroughTable._getTablePositionAndExtent();
  expect(tablePosition).toBeInstanceOf(Vector);
  expect(tablePosition.toString()).toBe("(X=1,Y=2,Z=3)");
  expect(tableExtent).toBeInstanceOf(Vector);
  expect(tableExtent.toString()).toBe("(X=3.5,Y=4,Z=4.5)");
});

it("_getTablePositionAndExtent (no table)", () => {
  const { tablePosition, tableExtent } =
    OnObjectFellThroughTable._getTablePositionAndExtent();
  expect(tablePosition).toBeInstanceOf(Vector);
  expect(tablePosition.toString()).toBe("(X=0,Y=0,Z=0)");
  expect(tableExtent).toBeInstanceOf(Vector);
  expect(tableExtent.toString()).toBe("(X=0,Y=0,Z=0)");
});

it("_findOrCreateZone", () => {
  new MockStaticObject({
    templateMetadata: "table:base/table",
    position: new Vector(1, 2, 3),
    _modelSize: new Vector(7, 8, 9),
  });

  const { tablePosition, tableExtent } =
    OnObjectFellThroughTable._getTablePositionAndExtent();
  expect(tablePosition.toString()).toBe("(X=1,Y=2,Z=3)");
  expect(tableExtent.toString()).toBe("(X=3.5,Y=4,Z=4.5)");

  const zone: Zone = OnObjectFellThroughTable._findOrCreateZone();
  expect(zone).toBeDefined();
  expect(zone.getId()).toBe("__below_table__");
  expect(zone.getPosition().toString()).toBe("(X=0,Y=0,Z=0.75)");
  expect(zone.getScale().toString()).toBe("(X=6.9,Y=7.9,Z=7.5)");

  const again: Zone = OnObjectFellThroughTable._findOrCreateZone();
  expect(again).toEqual(zone); // found exisiting zone.
});

it("_findOrCreateZone (no table)", () => {
  const zone: Zone = OnObjectFellThroughTable._findOrCreateZone();
  expect(zone).toBeDefined();
  expect(zone.getId()).toBe("__below_table__");
  expect(zone.getPosition().toString()).toBe("(X=0,Y=0,Z=-3)");
  expect(zone.getScale().toString()).toBe("(X=-0.1,Y=-0.1,Z=0)");
});

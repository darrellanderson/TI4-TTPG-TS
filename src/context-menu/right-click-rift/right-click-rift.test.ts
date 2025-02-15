import { GameObject, MockGameObject } from "ttpg-mock";
import { RightClickRift } from "./right-click-rift";

it("static applyRiftResult (yes)", () => {
  const unitObj: GameObject = MockGameObject.simple("unit:base/destroyer");
  const isSurvivor: boolean = true;
  RightClickRift.applyRiftResult(unitObj, isSurvivor);
});

it("static applyRiftResult (no)", () => {
  const unitObj: GameObject = MockGameObject.simple("unit:base/destroyer");
  const isSurvivor: boolean = false;
  RightClickRift.applyRiftResult(unitObj, isSurvivor);
});

it("static isRiftSystemTile", () => {
  const yes: GameObject = MockGameObject.simple("tile.system:base/41");
  const no: GameObject = MockGameObject.simple("tile.system:base/1");

  expect(RightClickRift.isRiftSystemTile(yes)).toBeTruthy();
  expect(RightClickRift.isRiftSystemTile(no)).toBeFalsy();
});

it("constructor/init", () => {
  const rift = new RightClickRift();
  expect(rift).toBeDefined();
  rift.init();
});

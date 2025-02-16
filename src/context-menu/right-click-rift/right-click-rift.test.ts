import { Player } from "@tabletop-playground/api";
import { GameObject, MockGameObject, MockPlayer } from "ttpg-mock";

import { RightClickRift } from "./right-click-rift";

it("static applyRiftResult (yes)", () => {
  const unitObj: MockGameObject = MockGameObject.simple("unit:base/destroyer");
  const rollValue: number = 4;
  RightClickRift.applyRiftResult(unitObj, rollValue);

  const player: Player = new MockPlayer();
  const thrown: boolean = false;
  unitObj._releaseAsPlayer(player, thrown);
});

it("static applyRiftResult (no)", () => {
  const unitObj: GameObject = MockGameObject.simple("unit:base/destroyer");
  const rollValue: number = 1;
  RightClickRift.applyRiftResult(unitObj, rollValue);
});

it("static isRiftSystemTile", () => {
  const yes: GameObject = MockGameObject.simple("tile.system:base/41");
  const no: GameObject = MockGameObject.simple("tile.system:base/1");

  expect(RightClickRift.isRiftSystemTile(yes)).toBeTruthy();
  expect(RightClickRift.isRiftSystemTile(no)).toBeFalsy();
});

it("constructor/init", () => {
  new MockGameObject(); // for an object to find
  const rift = new RightClickRift();
  expect(rift).toBeDefined();
  rift.init();
  new MockGameObject(); // for object created
});

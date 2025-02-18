import { GameObject, Player } from "@tabletop-playground/api";
import { MockGameObject, MockPlayer } from "ttpg-mock";

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

it("static getShipsInRift", () => {
  const riftObj: GameObject = MockGameObject.simple("tile.system:base/41");
  const ship: GameObject = MockGameObject.simple("unit:base/destroyer");
  const _shipOutsideHex: GameObject = MockGameObject.simple(
    "unit:base/destroyer",
    { position: [100, 0, 0] }
  );
  const ships: Array<GameObject> = RightClickRift.getShipsInRift(riftObj);
  expect(ships).toEqual([ship]);
});

it("static isRiftSystemTile", () => {
  const yes: GameObject = MockGameObject.simple("tile.system:base/41");
  const no: GameObject = MockGameObject.simple("tile.system:base/1");

  expect(RightClickRift.isRiftSystemTile(yes)).toBeTruthy();
  expect(RightClickRift.isRiftSystemTile(no)).toBeFalsy();
});

it("constructor/init", () => {
  MockGameObject.simple("tile.system:base/41"); // rift to find
  const rift = new RightClickRift();
  expect(rift).toBeDefined();
  rift.init();
  MockGameObject.simple("tile.system:base/41"); // rift obj created
});

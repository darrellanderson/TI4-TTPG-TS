import {
  GameObject,
  MockGameObject,
  mockGlobalEvents,
  MockPlayer,
} from "ttpg-mock";
import { NumpadKeyRecycle } from "./numpad-key-recycle";
import { Player } from "@tabletop-playground/api";
import { GarbageContainer, GarbageHandler } from "ttpg-darrell";

class MyGarbageHandler extends GarbageHandler {
  canRecycle(_obj: GameObject): boolean {
    return true;
  }
  recycle(obj: GameObject): boolean {
    obj.destroy();
    return true;
  }
}

it("grant access and recycle", () => {
  GarbageContainer.addHandler(new MyGarbageHandler());

  const obj: GameObject = new MockGameObject({
    templateMetadata: "token:base/my-nsid",
  });
  const player: Player = new MockPlayer({
    name: "my-name",
    heldObjects: [obj],
  });

  const key: number = 19; // won't conflict with actual key number
  const numpadKeyRecycle = new NumpadKeyRecycle(key);
  expect(numpadKeyRecycle._getCtrlKeyCount(player)).toBe(0);
  expect(obj.isValid()).toBe(true);

  // Try normal key press, rejected because not yet authorized.
  mockGlobalEvents._scriptButtonPressedAsPlayer(player, key, false, false);
  expect(obj.isValid()).toBe(true);

  // Send ctrl+key three times to authorize recycling.
  mockGlobalEvents._scriptButtonPressedAsPlayer(player, key, true, false);
  expect(numpadKeyRecycle._getCtrlKeyCount(player)).toBe(1);
  mockGlobalEvents._scriptButtonPressedAsPlayer(player, key, true, false);
  expect(numpadKeyRecycle._getCtrlKeyCount(player)).toBe(2);

  // Check that recycling is not yet authorized.
  mockGlobalEvents._scriptButtonPressedAsPlayer(player, key, false, false);
  expect(obj.isValid()).toBe(true);

  mockGlobalEvents._scriptButtonPressedAsPlayer(player, key, true, false);
  expect(numpadKeyRecycle._getCtrlKeyCount(player)).toBe(3);

  // Check that recycling is now authorized.
  mockGlobalEvents._scriptButtonPressedAsPlayer(player, key, false, false);
  expect(obj.isValid()).toBe(false);

  numpadKeyRecycle.destroy();
});

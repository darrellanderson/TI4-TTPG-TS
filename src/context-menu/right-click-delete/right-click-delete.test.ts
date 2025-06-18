import { Player } from "@tabletop-playground/api";
import { MockGameObject, MockPlayer } from "ttpg-mock";
import { ACTION_DELETE, RightClickDelete } from "./right-click-delete";

it("constructor/init/event", () => {
  // Existing object.
  const existingObj: MockGameObject = MockGameObject.simple("nsid1");

  new RightClickDelete().init();
  process.flushTicks();

  const newObj: MockGameObject = MockGameObject.simple("nsid2");
  expect(existingObj.isValid()).toBeTruthy();
  expect(newObj.isValid()).toBeTruthy();

  const action: string = ACTION_DELETE;
  const player: Player = new MockPlayer();

  existingObj._customActionAsPlayer(player, action);
  expect(existingObj.isValid()).toBeFalsy();
  expect(newObj.isValid()).toBeTruthy();

  newObj._customActionAsPlayer(player, action);
  expect(existingObj.isValid()).toBeFalsy();
  expect(newObj.isValid()).toBeFalsy();
});

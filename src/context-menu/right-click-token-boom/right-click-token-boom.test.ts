import { MockGameObject, MockPlayer } from "ttpg-mock";
import {
  ACTION_BOOM,
  NSID_BOOM_TOKEN,
  RightClickTokenBoom,
} from "./right-click-token-boom";
import { Player } from "@tabletop-playground/api";

it("constructor/init", () => {
  new RightClickTokenBoom().init();
});

it("existing object, new object", () => {
  MockGameObject.simple(NSID_BOOM_TOKEN); // existing
  new RightClickTokenBoom().init();
  MockGameObject.simple(NSID_BOOM_TOKEN); // new
});

it("event", () => {
  new RightClickTokenBoom().init();
  const obj: MockGameObject = MockGameObject.simple(NSID_BOOM_TOKEN);
  const player: Player = new MockPlayer();
  obj._customActionAsPlayer(player, ACTION_BOOM);
});

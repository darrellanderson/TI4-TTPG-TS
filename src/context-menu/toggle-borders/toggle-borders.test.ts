import { mockGlobalEvents, MockPlayer } from "ttpg-mock";
import { TOGGLE_BORDERS_ACTION, ToggleBorders } from "./toggle-borders";

it("click", () => {
  new ToggleBorders().init();
  const player = new MockPlayer();
  mockGlobalEvents._customActionAsPlayer(player, TOGGLE_BORDERS_ACTION);
});

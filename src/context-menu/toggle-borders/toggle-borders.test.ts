import { mockGlobalEvents, MockPlayer } from "ttpg-mock";
import { ToggleBorders } from "./toggle-borders";

it("click", () => {
  new ToggleBorders().init();
  const player = new MockPlayer();
  mockGlobalEvents._customActionAsPlayer(player, "*Toggle borders");
});

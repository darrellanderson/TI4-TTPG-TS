import { clickAll } from "ttpg-mock";
import { StartGameUI } from "./start-game-ui";

it("constructor", () => {
  const scale: number = 1;
  new StartGameUI(scale);
});

it("clickAll", () => {
  const scale: number = 1;
  const startGameUI = new StartGameUI(scale);
  clickAll(startGameUI.getWidget());
});

import { clickAll } from "ttpg-mock";
import { StartGameUI } from "./start-game-ui";

it("constructor", () => {
  const scale: number = 1;
  new StartGameUI(scale);
});

it("clickAll", () => {
  const scale: number = 1;
  const startGameUI = new StartGameUI(scale);

  // Game start needs more state than mock can set up simply.
  // Instead, clear the event handler.
  TI4.events.onStartGameRequest.clear();

  clickAll(startGameUI.getWidget());
  clickAll(startGameUI.getWidget());
  TI4.timer.stop();
});

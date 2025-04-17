import { StartGameWindow } from "./start-game-window";

it("constructor/init", () => {
  new StartGameWindow().init();
  process.flushTicks();
  try {
    TI4.events.onStartGameRequest.trigger();
  } catch (_e) {
    // full setup requires more state than the mock objects provide
  }
});

it("constructor/init (already started)", () => {
  TI4.config.setTimestamp(1);
  new StartGameWindow().init();
});

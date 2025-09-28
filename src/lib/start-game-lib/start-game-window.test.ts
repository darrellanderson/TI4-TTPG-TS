import { StartGameWindow } from "./start-game-window";

it("constructor/init", () => {
  new StartGameWindow().init();
  process.flushTicks();
  try {
    globalThis.TI4.events.onStartGameRequest.trigger();
  } catch (_e) {
    // full setup requires more state than the mock objects provide
  }
  globalThis.TI4.timer.stop();
});

it("constructor/init (already started)", () => {
  globalThis.TI4.config.setTimestamp(1);
  new StartGameWindow().init();
});

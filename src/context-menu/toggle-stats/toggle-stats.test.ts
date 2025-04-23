import { ToggleStats } from "./toggle-stats";

it("constructor/init", () => {
  new ToggleStats().init();
  TI4.events.onGameData.trigger({ players: [] });
});

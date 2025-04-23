import { GameData } from "lib/game-data-lib/game-data/game-data";
import { ToggleAllPlayersTech } from "./toggle-all-players-tech";

it("constructor/init", () => {
  new ToggleAllPlayersTech().init();
});

it("event", () => {
  new ToggleAllPlayersTech().init();

  const gameData1: GameData = { players: [{ technologies: ["a"] }] };
  TI4.events.onGameData.trigger(gameData1);

  const gameData2: GameData = { players: [{ technologies: ["a", "b"] }] };
  TI4.events.onGameData.trigger(gameData2);
});

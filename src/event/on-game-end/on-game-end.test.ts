import {
  GameData,
  PerPlayerGameData,
} from "../../lib/game-data-lib/game-data/game-data";
import { GameDataUpdator } from "../../lib/game-data-lib/game-data-updator/game-data-updator";
import { OnGameEnd } from "./on-game-end";

it("constructor/init", () => {
  const onGameEnd: OnGameEnd = new OnGameEnd();
  onGameEnd.init();
});

it("event", () => {
  // Use the global OnGameEnd (vs creating a local one).
  let onGameEndCount: number = 0;
  TI4.events.onGameEnd.add(() => {
    onGameEndCount++;
  });
  expect(onGameEndCount).toBe(0);

  const gameData: GameData = GameDataUpdator.createGameData();
  const playerData: PerPlayerGameData | undefined = gameData.players[0];
  if (!playerData) {
    throw new Error("Player data is undefined");
  }
  playerData.score = TI4.config.gamePoints;
  TI4.events.onGameData.trigger(gameData);
  expect(onGameEndCount).toBe(1);
});

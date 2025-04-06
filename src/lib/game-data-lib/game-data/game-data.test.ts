import { GameData, PerPlayerGameData } from "./game-data";

it("use gameData", () => {
  const gameData: GameData = { players: [] };
  expect(gameData).toBeDefined();
});

it("use perPlayerGameData", () => {
  const playerData: PerPlayerGameData = {};
  expect(playerData).toBeDefined();
});

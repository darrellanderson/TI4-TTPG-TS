import { GameData } from "../game-data/game-data";
import { IGameDataUpdator } from "../i-game-data-updator/i-game-data-updator";
import { GameDataUpdator } from "./game-data-updator";

class MyUpdator implements IGameDataUpdator {
  update(_gameData: GameData): void {}
}

it("satic createGameData", () => {
  const gameData: GameData = GameDataUpdator.createGameData();
  expect(gameData).toBeDefined();
});

it("static getPlayerData", () => {
  const gameData: GameData = GameDataUpdator.createGameData();
  const playerData = GameDataUpdator.getPlayerData(gameData, 0);
  expect(playerData).toBeDefined();
});

it("static getPlayerData (invalid index)", () => {
  const gameData: GameData = GameDataUpdator.createGameData();
  expect(() => {
    GameDataUpdator.getPlayerData(gameData, 100);
  }).toThrow();
});

it("constructor", () => {
  const updators: Array<IGameDataUpdator> = [new MyUpdator()];
  new GameDataUpdator(updators);
});

it("start/stop periodic updates", () => {
  const updators: Array<IGameDataUpdator> = [new MyUpdator()];
  const gameDataUpdator: GameDataUpdator = new GameDataUpdator(updators);
  gameDataUpdator.startPeriodicUpdates();
  gameDataUpdator.startPeriodicUpdates(); // again, resets
  gameDataUpdator.stopPeriodicUpdates();
});

it("_processNext", () => {
  const updators: Array<IGameDataUpdator> = [
    new MyUpdator(),
    new MyUpdator(),
    new MyUpdator(),
  ];
  const gameDataUpdator: GameDataUpdator = new GameDataUpdator(updators);
  expect(gameDataUpdator._processNext()).toBe(false);
  expect(gameDataUpdator._processNext()).toBe(false);
  expect(gameDataUpdator._processNext()).toBe(true);
  expect(gameDataUpdator._processNext()).toBe(false);
  expect(gameDataUpdator._processNext()).toBe(false);
  expect(gameDataUpdator._processNext()).toBe(true);
});

it("_onPeriodicUpdateStart", () => {
  const updators: Array<IGameDataUpdator> = [new MyUpdator()];
  const gameDataUpdator: GameDataUpdator = new GameDataUpdator(updators);
  gameDataUpdator._onPeriodicUpdateStart();
});

it("_onTickHandler", () => {
  const updators: Array<IGameDataUpdator> = [new MyUpdator()];
  const gameDataUpdator: GameDataUpdator = new GameDataUpdator(updators);
  gameDataUpdator._onTickHandler();
});

it("update cycle (start, tick)", () => {
  const updators: Array<IGameDataUpdator> = [new MyUpdator()];
  const gameDataUpdator: GameDataUpdator = new GameDataUpdator(updators);
  gameDataUpdator._onPeriodicUpdateStart();
  gameDataUpdator._onTickHandler();
});

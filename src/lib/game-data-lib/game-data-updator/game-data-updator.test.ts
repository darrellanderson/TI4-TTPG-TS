import { ErrorHandler } from "ttpg-darrell";
import { GameData } from "../game-data/game-data";
import { IGameDataUpdator } from "../i-game-data-updator/i-game-data-updator";
import { GameDataUpdator } from "./game-data-updator";

class MyUpdator implements IGameDataUpdator {
  update(_gameData: GameData): void {}
}

class MyErrorUpdator implements IGameDataUpdator {
  update(_gameData: GameData): void {
    throw new Error("Test error");
  }
}

it("satic createGameData", () => {
  const gameData: GameData = GameDataUpdator.createGameData();
  expect(gameData).toBeDefined();
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

it("_processNext (error)", () => {
  const errors: Array<string> = [];
  ErrorHandler.onError.add((error: string) => {
    errors.push(error);
  });

  const updators: Array<IGameDataUpdator> = [new MyErrorUpdator()];
  const gameDataUpdator: GameDataUpdator = new GameDataUpdator(updators);
  gameDataUpdator._processNext();

  expect(errors.length).toBe(1);
  expect(errors[0]?.split("\n")[0]).toEqual("Error: Error: Test error");
});

it("_onInterval", () => {
  const updators: Array<IGameDataUpdator> = [new MyUpdator()];
  const gameDataUpdator: GameDataUpdator = new GameDataUpdator(updators);
  gameDataUpdator._onInterval();
  gameDataUpdator._onInterval();
  gameDataUpdator._onInterval();
});

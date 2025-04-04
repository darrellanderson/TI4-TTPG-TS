import { AbstractGameData } from "./abstract-game-data";

class MyGameDataNone extends AbstractGameData<number> {
  getFieldName(): string {
    return "myField";
  }
}

class MyGameDataFull extends AbstractGameData<number> {
  getFieldName(): string {
    return "myField";
  }

  getRootData(): number | undefined {
    return 42;
  }

  getPlayerData(): Map<number, number> | undefined {
    const playerData = new Map<number, number>();
    playerData.set(1, 10);
    return playerData;
  }
}

it("constructor", () => {
  new MyGameDataNone();
});

it("getFieldName", () => {
  const gameData = new MyGameDataNone();
  expect(gameData.getFieldName()).toBe("myField");
});

it("getRootData (none)", () => {
  const gameData = new MyGameDataNone();
  expect(gameData.getRootData()).toBeUndefined();
});

it("getPlayerData (none)", () => {
  const gameData = new MyGameDataNone();
  expect(gameData.getPlayerData()).toBeUndefined();
});

it("getRootData (full)", () => {
  const gameData = new MyGameDataFull();
  expect(gameData.getRootData()).toBe(42);
});

it("getPlayerData (full)", () => {
  const gameData = new MyGameDataFull();
  const playerData = gameData.getPlayerData();
  expect(playerData).toBeDefined();
  expect(playerData?.size).toBe(1);
  if (playerData) {
    expect(playerData.get(1)).toBe(10);
  }
});

import {
  AbstractPerPlayerGameData,
  AbstractRootGameData,
} from "./abstract-game-data";

class MyRootGameDataNone extends AbstractRootGameData<number> {
  getFieldName(): string {
    return "myField";
  }
  getRootData(): number | undefined {
    return undefined;
  }
}

class MyRootGameDataFull extends AbstractRootGameData<number> {
  getFieldName(): string {
    return "myField";
  }

  getRootData(): number | undefined {
    return 42;
  }
}

class MyPerPlayerGameDataNone extends AbstractPerPlayerGameData<number> {
  getFieldName(): string {
    return "myField";
  }

  getPlayerData(): Map<number, number> | undefined {
    return undefined;
  }
}

class MyPerPlayerGameDataFull extends AbstractPerPlayerGameData<number> {
  getFieldName(): string {
    return "myField";
  }

  getPlayerData(): Map<number, number> | undefined {
    const playerData = new Map<number, number>();
    playerData.set(10, 42);
    return playerData;
  }
}

it("constructors", () => {
  new MyPerPlayerGameDataFull();
  new MyPerPlayerGameDataNone();
  new MyRootGameDataFull();
  new MyRootGameDataNone();
});

it("getFieldName", () => {
  const rootGameData = new MyRootGameDataNone();
  expect(rootGameData.getFieldName()).toBe("myField");

  const perPlayerGameData = new MyPerPlayerGameDataNone();
  expect(perPlayerGameData.getFieldName()).toBe("myField");
});

it("getRootData (none)", () => {
  const gameData = new MyRootGameDataNone();
  expect(gameData.getRootData()).toBeUndefined();
});

it("getPlayerData (none)", () => {
  const gameData = new MyPerPlayerGameDataNone();
  expect(gameData.getPlayerData()).toBeUndefined();
});

it("getRootData (full)", () => {
  const gameData = new MyRootGameDataFull();
  expect(gameData.getRootData()).toBe(42);
});

it("getPlayerData (full)", () => {
  const gameData = new MyPerPlayerGameDataFull();
  const playerData = gameData.getPlayerData();
  expect(playerData).toBeDefined();
  expect(playerData?.size).toBe(1);
  if (playerData) {
    expect(playerData.get(10)).toBe(42);
  }
});

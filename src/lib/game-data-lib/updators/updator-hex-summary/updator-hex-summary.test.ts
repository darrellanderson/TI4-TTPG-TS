import { GameData } from "../../game-data/game-data";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { UpdatorHexSummary } from "./updator-hex-summary";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorHexSummary;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorHexSummary().update(gameData);
  expect(gameData.hexSummary).toBeDefined();
});

it("_mergeEntityTypes", () => {
  const updator: UpdatorHexSummary = new UpdatorHexSummary();
  const entityTypes = [
    { code: "A", colorCode: "red", planetIndex: 1, count: 1 },
    { code: "A", colorCode: "red", planetIndex: 1, count: 2 },
    { code: "B", colorCode: "blue", planetIndex: 2, count: 1 },
    { code: "B", colorCode: "blue", planetIndex: 2, count: 3 },
    { code: "C", colorCode: "green", planetIndex: 3, count: 1 },
  ];

  const merged = updator._mergeEntityTypes(entityTypes);

  expect(merged.length).toBe(3);
  expect(merged).toEqual([
    {
      code: "A",
      colorCode: "red",
      planetIndex: 1,
      count: 3,
    },
    {
      code: "B",
      colorCode: "blue",
      planetIndex: 2,
      count: 4,
    },
    {
      code: "C",
      colorCode: "green",
      planetIndex: 3,
      count: 1,
    },
  ]);
});

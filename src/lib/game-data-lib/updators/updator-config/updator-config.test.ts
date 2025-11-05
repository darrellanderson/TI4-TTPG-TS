import { GameData } from "../../game-data/game-data";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { UpdatorConfig } from "./updator-config";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorConfig;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  TI4.config.setSources(["pok", "codex.affinity"]);
  expect(TI4.config.sources).toContain("pok");

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorConfig().update(gameData);
  expect(gameData.config).toEqual({
    pok: true,
    codex1: true,
    codex2: false,
    codex3: false,
    codex4: false,
    te: false,
    tf: false,
  });
});

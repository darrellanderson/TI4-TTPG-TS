import { Player } from "@tabletop-playground/api";
import { MockGameObject, MockPlayer } from "ttpg-mock";
import { System } from "../../system-lib/system/system";
import { GameData } from "../game-data/game-data";
import { GameDataUpdator } from "../game-data-updator/game-data-updator";
import { UpdatorActiveSystem } from "./updator-active-system";

it("constructor", () => {
  new UpdatorActiveSystem();
});

it("get (empty)", () => {
  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorActiveSystem().update(gameData);
  expect(gameData.activeSystem).toBeUndefined();
});

it("get (with data)", () => {
  MockGameObject.simple("tile.system:base/18");
  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(18);
  if (!system) {
    throw new Error("System not found");
  }
  const player: Player = new MockPlayer();
  TI4.events.onSystemActivated.trigger(system, player);

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorActiveSystem().update(gameData);
  expect(gameData.activeSystem).toEqual({
    tile: 18,
    planets: ["Mecatol Rex"],
  });
});

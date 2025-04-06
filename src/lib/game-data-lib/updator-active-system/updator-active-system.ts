import { OnSystemActivated } from "../../../event/on-system-activated/on-system-activated";
import { System } from "../../system-lib/system/system";
import { GameData } from "../game-data/game-data";
import { IGameDataUpdator } from "../i-game-data-updator/i-game-data-updator";

export type UpdatorActiveSystemType = {
  tile: number;
  planets: Array<string>;
};

export class UpdatorActiveSystem implements IGameDataUpdator {
  update(gameData: GameData): void {
    const activeSystem: System | undefined =
      OnSystemActivated.getLastActivatedSystem();
    if (activeSystem) {
      gameData.activeSystem = {
        tile: activeSystem.getSystemTileNumber(),
        planets: activeSystem.getPlanets().map((planet) => planet.getName()),
      };
    } else {
      delete gameData.activeSystem;
    }
  }
}

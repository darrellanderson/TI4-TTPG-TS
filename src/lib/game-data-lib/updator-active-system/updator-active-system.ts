import { OnSystemActivated } from "../../../event/on-system-activated/on-system-activated";
import { System } from "../../system-lib/system/system";
import { GameData } from "../game-data/game-data";
import { IGameDataUpdator } from "../i-game-data-updator/i-game-data-updator";
import { UpdatorActiveSystemType } from "./updator-active-system-type";

export class UpdatorActiveSystem implements IGameDataUpdator {
  update(gameData: GameData): void {
    const lastActivatedSystem: System | undefined =
      OnSystemActivated.getLastActivatedSystem();
    if (lastActivatedSystem) {
      const activeSystem: UpdatorActiveSystemType = {
        tile: lastActivatedSystem.getSystemTileNumber(),
        planets: lastActivatedSystem
          .getPlanets()
          .map((planet) => planet.getName()),
      };
      gameData.activeSystem = activeSystem;
    } else {
      delete gameData.activeSystem;
    }
  }
}

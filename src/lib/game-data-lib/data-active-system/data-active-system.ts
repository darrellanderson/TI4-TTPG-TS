import { OnSystemActivated } from "../../../event/on-system-activated/on-system-activated";
import { System } from "../../system-lib/system/system";
import { AbstractRootGameData } from "../abstract-game-data/abstract-game-data";

export type DataActiveSystemType = {
  tile: number;
  planets: Array<string>;
};

export class DataActiveSystem extends AbstractRootGameData<DataActiveSystemType> {
  getFieldName(): string {
    return "activeSystem";
  }

  getRootData(): DataActiveSystemType | undefined {
    const activeSystem: System | undefined =
      OnSystemActivated.getLastActivatedSystem();
    if (activeSystem) {
      return {
        tile: activeSystem.getSystemTileNumber(),
        planets: activeSystem.getPlanets().map((planet) => planet.getName()),
      };
    }
    return undefined;
  }
}

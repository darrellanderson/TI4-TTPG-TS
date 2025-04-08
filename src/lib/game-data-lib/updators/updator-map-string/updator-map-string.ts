import { MapStringSave } from "../../../map-string-lib/map-string/map-string-save";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";

export class UpdatorMapString implements IGameDataUpdator {
  private readonly _mapStringSave: MapStringSave = new MapStringSave();

  update(gameData: GameData): void {
    gameData.mapString = this._mapStringSave.save();
  }
}

import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { UpdatorConfigType } from "./updator-config-type";

export class UpdatorConfig implements IGameDataUpdator {
  update(gameData: GameData): void {
    const sources: Set<string> = new Set<string>(TI4.config.sources);
    const config: UpdatorConfigType = {
      pok: sources.has("pok"),
      codex1: sources.has("codex.affinity"),
      codex2: sources.has("codex.ordinian"),
      codex3: sources.has("codex.vigil"),
      codex4: false,
    };
    gameData.config = config;
    gameData.platform = "ttpg";
  }
}

import { Facing } from "ttpg-darrell";
import { Scoreboard } from "../../../score-lib/scoreboard/scoreboard";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { GameObject } from "@tabletop-playground/api";

export class UpdatorScoreboard implements IGameDataUpdator {
  private readonly _scoreboard: Scoreboard = new Scoreboard();

  update(gameData: GameData): void {
    const scoreboardObj: GameObject | undefined =
      this._scoreboard.getScoreboard();
    let faceUp: boolean = false;
    if (scoreboardObj && Facing.isFaceUp(scoreboardObj)) {
      faceUp = true;
    }

    gameData.scoreboard = faceUp ? 10 : 14;
  }
}

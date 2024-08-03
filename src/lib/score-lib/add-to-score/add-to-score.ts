import { GameObject, Vector } from "@tabletop-playground/api";
import { Scoreboard } from "../scoreboard/scoreboard";

export class AddToScore {
  private readonly _scoreboard: Scoreboard = new Scoreboard();

  public addToScore(playerSlot: number, delta: number): boolean {
    const playerSlotToToken: Map<number, GameObject> =
      this._scoreboard._getPlayerSlotToLeadControlToken();
    const token: GameObject | undefined = playerSlotToToken.get(playerSlot);
    if (token) {
      const pos: Vector = token.getPosition();
      const score: number | undefined = this._scoreboard.posToScore(pos);
      if (score !== undefined) {
        const newScore: number = score + delta;
        const newPos: Vector | undefined = this._scoreboard.scoreToPos(
          newScore,
          playerSlot
        );
        if (newPos !== undefined) {
          const animationSpeed: number = 1;
          token.setPosition(newPos.add([0, 0, 1]), animationSpeed);
          token.snapToGround();
          return true;
        }
      }
    }
    return false;
  }
}

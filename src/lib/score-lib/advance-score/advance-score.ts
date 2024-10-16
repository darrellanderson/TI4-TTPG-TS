import { GameObject, Vector, world } from "@tabletop-playground/api";
import { Scoreboard } from "../scoreboard/scoreboard";

export class AdvanceScore {
  private readonly _scoreboard: Scoreboard = new Scoreboard();

  public addToScore(playerSlot: number, delta: number): boolean {
    const token: GameObject | undefined =
      this._scoreboard.getLeadControlToken(playerSlot);
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
          newPos.z = world.getTableHeight() + 10;
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

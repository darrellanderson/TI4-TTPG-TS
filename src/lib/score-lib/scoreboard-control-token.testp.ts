import { refObject, Vector, world } from "@tabletop-playground/api";
import { Scoreboard } from "./scoreboard";

const _scoreboardLib = new Scoreboard();

refObject.onReleased.add((obj): void => {
  const pos: Vector = obj.getPosition();
  const score: number = _scoreboardLib.posToScore(pos) ?? -999;
  console.log(`score: ${score}`);

  const playerSlot: number = obj.getOwningPlayerSlot();
  const rev: Vector =
    _scoreboardLib.scoreToPos(score, playerSlot) ??
    new Vector(-999, -999, -999);
  const distance: number = pos.distance(rev);
  console.log(`distance: ${distance} (${rev.toString()})`);

  world.showPing(rev, [1, 0, 0, 1], false);
});

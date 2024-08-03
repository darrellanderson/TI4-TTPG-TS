import {
  GameObject,
  refObject,
  Rotator,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Spawn } from "ttpg-darrell";
import { ScoreboardLib } from "./scoreboard-lib";

for (const obj of world.getAllObjects()) {
  if (obj !== refObject) {
    obj.destroy();
  }
}

console.log("scoreboard.testp.ts");

const dx: number = 40;
const dy: number = 20;
const z: number = world.getTableHeight() + 10;
const posArray: Array<Vector> = [
  new Vector(dx, dy, z),
  new Vector(dx, 0, z),
  new Vector(dx, -dy, z),
  new Vector(-dx, -dy, z),
  new Vector(-dx, 0, z),
  new Vector(-dx, dy, z),
];

let obj: GameObject;

Spawn.spawnOrThrow("token:base/scoreboard", [0, 0, z]);
const scoreboardLib: ScoreboardLib = new ScoreboardLib();

posArray.forEach((pos: Vector, index: number) => {
  obj = Spawn.spawnOrThrow("card-holder:base/player-hand", pos);
  obj.setOwningPlayerSlot(index + 1);
});

for (let i = 0; i < posArray.length; i++) {
  obj = Spawn.spawnOrThrow("token.control:base/sol");
  obj.setOwningPlayerSlot(i + 1);
  obj.setPrimaryColor(world.getSlotColor(i + 1));
  const pos: Vector = scoreboardLib.scoreToPos(1, i + 1) ?? new Vector(0, 0, 0);
  const rot: Rotator =
    scoreboardLib.getControlTokenRotation() ?? new Rotator(0, 0, 0);
  obj.setPosition(pos);
  obj.setRotation(rot);
  obj.snapToGround();
}

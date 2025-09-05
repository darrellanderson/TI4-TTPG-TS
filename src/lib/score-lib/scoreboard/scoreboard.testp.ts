import {
  GameObject,
  refObject,
  Rotator,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Scoreboard } from "./scoreboard";

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

obj = TI4.spawn.spawnOrThrow("token:base/scoreboard", [0, 0, z]);
obj.setRotation(new Rotator(0, 0, 180));
obj.snapToGround();
const scoreboardLib: Scoreboard = new Scoreboard();

posArray.forEach((pos: Vector, index: number) => {
  obj = TI4.spawn.spawnOrThrow("card-holder:base/player-hand", pos);
  obj.setOwningPlayerSlot(index + 1);
});

for (let i = 0; i < posArray.length; i++) {
  obj = TI4.spawn.spawnOrThrow("token.control:base/sol");
  obj.setOwningPlayerSlot(i + 1);
  obj.setPrimaryColor(world.getSlotColor(i + 1));
  const pos: Vector = scoreboardLib.scoreToPos(1, i + 1) ?? new Vector(0, 0, 0);
  const rot: Rotator =
    scoreboardLib.getControlTokenRotation() ?? new Rotator(0, 0, 0);
  console.log(pos.toString(), world.getTableHeight());
  obj.setPosition(pos.add([0, 0, 5]));
  obj.setRotation(rot);
  obj.snapToGround();
}

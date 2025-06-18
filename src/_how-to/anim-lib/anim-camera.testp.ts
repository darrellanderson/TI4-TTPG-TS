import {
  Player,
  refObject,
  Rotator,
  Vector,
  world,
} from "@tabletop-playground/api";
import { AnimCamera } from "./anim-camera";

const maybePlayer: Player | undefined = world.getAllPlayers()[0];
if (!maybePlayer) {
  throw new Error("No player found");
}
const player: Player = maybePlayer;

const lookFrom: Vector = new Vector(-9, 0, world.getTableHeight() + 1);
const lookAt: Vector = new Vector(0, 0, lookFrom.z - 0.1);
const r0: Rotator = lookFrom.findLookAtRotation(lookAt);
const p1: Vector = new Vector(0, 0, world.getTableHeight() + 70);

function go() {
  AnimCamera.simple(p1).then(() => {
    console.log("AnimCamera done");
  });
}

const actionName: string = "*Anim-camera";
refObject.addCustomAction(actionName);
refObject.onCustomAction.add((_obj, _player, action) => {
  if (action === actionName) {
    player.setPositionAndRotation(lookFrom, r0);
    process.nextTick(() => {
      go();
    });
  }
});

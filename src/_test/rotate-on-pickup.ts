import { GameObject, Player, refObject } from "@tabletop-playground/api";

refObject.onGrab.add((obj: GameObject, _player: Player) => {
  obj.setRotation([0, 0, 270]);
});

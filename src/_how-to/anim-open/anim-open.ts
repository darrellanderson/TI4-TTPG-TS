import {
  Color,
  GameObject,
  Player,
  refObject,
  UIElement,
  Vector,
  world,
} from "@tabletop-playground/api";
import { AnimActor } from "./anim-actor";
import { AnimLaser } from "./anim-laser";
import { UiTitle } from "./ui-title";

export class AnimOpen {
  constructor(obj: GameObject) {
    const actionName: string = "*Anim-open";
    obj.addCustomAction(actionName);
    obj.onCustomAction.add(
      (_obj: GameObject, player: Player, action: string): void => {
        if (action === actionName) {
          this.go(player);
        }
      }
    );
  }

  go(player: Player): void {
    const ui: UIElement = new UiTitle()._createTitleUI();
    world.addUI(ui);

    const z: number = world.getTableHeight() + 5;

    const lookFrom: Vector = new Vector(-9, 0, world.getTableHeight() + 1);
    const lookAt: Vector = new Vector(0, 0, lookFrom.z - 0.1);
    player.setPositionAndRotation(
      lookFrom,
      lookFrom.findLookAtRotation(lookAt)
    );
    console.log(
      "Player position set to:",
      player.getPosition().toString(),
      "expected",
      lookFrom.toString()
    );

    const carrier: AnimActor = new AnimActor({
      nsid: "unit:base/carrier",
      scale: 1,
      color: new Color(1, 1, 1, 1),
      p0: new Vector(-60, 10, z),
      p1: new Vector(120, -20, z),
      speed: 5,
    });

    const dreadnought: AnimActor = new AnimActor({
      nsid: "unit:base/dreadnought",
      scale: 3,
      color: new Color(1, 1, 1, 1),
      p0: new Vector(-90, 15, z),
      p1: new Vector(120, -20, z),
      speed: 5,
    });

    const _laser: AnimLaser = new AnimLaser(
      carrier.getObj(),
      dreadnought.getObj()
    );
  }
}

new AnimOpen(refObject);

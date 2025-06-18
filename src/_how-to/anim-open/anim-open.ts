import {
  Color,
  Player,
  UIElement,
  Vector,
  world,
} from "@tabletop-playground/api";
import { AnimActor } from "../anim-lib/anim-actor";
import { AnimLaser } from "./anim-laser";
import { UiTitle } from "./ui-title";
import { AnimCamera } from "_how-to/anim-lib/anim-camera";

export class AnimOpen {
  go(player: Player): Promise<void> {
    const uiTitle: UiTitle = new UiTitle();
    const ui: UIElement = uiTitle._createTitleUI();
    world.addUI(ui);

    const z: number = world.getTableHeight() + 5;

    const lookFrom: Vector = new Vector(-9, 0, world.getTableHeight() + 1);
    const lookAt: Vector = new Vector(0, 0, lookFrom.z - 0.1);
    player.setPositionAndRotation(
      lookFrom,
      lookFrom.findLookAtRotation(lookAt)
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

    carrier.onDestroyed.add(() => {
      dreadnought.destroy();
      world.removeUIElement(ui);
    });

    return new Promise<void>((resolve) => {
      let crossMsecs: number = 0;
      let startedAnimCamera: boolean = false;
      carrier.getObj().onTick.add(() => {
        if (crossMsecs === 0 && carrier.getObj().getPosition().x > 40) {
          crossMsecs = Date.now();
        }
        if (crossMsecs > 0) {
          const msecs: number = Date.now() - crossMsecs;
          const tint: number = Math.max((3000 - msecs) / 3000, 0);
          uiTitle.tint(tint);

          let color: Color;
          color = carrier.getObj().getPrimaryColor();
          color.a = tint;
          carrier.getObj().setPrimaryColor(color);
          carrier.getObj().setSecondaryColor(color);

          color = dreadnought.getObj().getPrimaryColor();
          color.a = tint;
          dreadnought.getObj().setPrimaryColor(color);
          dreadnought.getObj().setSecondaryColor(color);

          if (tint <= 0 && !startedAnimCamera) {
            startedAnimCamera = true;
            const p1: Vector = new Vector(0, 0, world.getTableHeight() + 70);
            AnimCamera.simple(p1).then(resolve);
          }
        }
      });
    });
  }
}

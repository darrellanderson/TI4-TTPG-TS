import {
  GameObject,
  Player,
  refObject,
  Vector,
  world,
} from "@tabletop-playground/api";
import { AnimOpen } from "./anim-open";
import { AnimCamera } from "_how-to/anim-lib/anim-camera";

const actionName: string = "*Anim-open";
refObject.addCustomAction(actionName);
refObject.onCustomAction.add(
  (_obj: GameObject, player: Player, action: string): void => {
    if (action === actionName) {
      new AnimOpen().go(player).then(() => {
        console.log("AnimOpen done");
        const pos15: Vector = TI4.playerSeats
          .getDealPosition(15)
          .add([-25, 0, 0]);
        pos15.z = world.getTableHeight() + 80;
        AnimCamera.simple(pos15).then(() => {
          console.log("AnimCamera slot 15 done");

          const pos12: Vector = TI4.playerSeats
            .getDealPosition(12)
            .add([25, 0, 0]);
          pos12.z = world.getTableHeight() + 80;
          AnimCamera.simple(pos12).then(() => {});
        });
      });
    }
  }
);

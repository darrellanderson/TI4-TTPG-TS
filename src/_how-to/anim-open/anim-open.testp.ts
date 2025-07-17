import { GameObject, Player, refObject } from "@tabletop-playground/api";
import { AnimOpen } from "./anim-open";

const actionName: string = "*Anim-open";
refObject.addCustomAction(actionName);
refObject.onCustomAction.add(
  (_obj: GameObject, player: Player, action: string): void => {
    if (action === actionName) {
      new AnimOpen().go(player).then(() => {
        console.log("AnimOpen done");
      });
    }
  }
);

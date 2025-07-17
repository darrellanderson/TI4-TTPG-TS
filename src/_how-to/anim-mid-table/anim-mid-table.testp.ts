import { GameObject, Player, refObject } from "@tabletop-playground/api";
import { AnimMidTable } from "./anim-mid-table";

function go() {
  console.log("Starting AnimMidTable");
  new AnimMidTable().tour().then(() => {
    console.log("Animation complete");
  });
}

const actionName: string = "*Anim-table";
refObject.addCustomAction(actionName);
refObject.onCustomAction.add(
  (_obj: GameObject, _player: Player, action: string): void => {
    if (action === actionName) {
      go();
    }
  }
);

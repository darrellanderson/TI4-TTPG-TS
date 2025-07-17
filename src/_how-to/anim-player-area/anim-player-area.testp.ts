import { GameObject, Player, refObject } from "@tabletop-playground/api";
import { AnimPlayerArea } from "./anim-player-area";

async function runTour() {
  console.log("Starting 15");
  await new AnimPlayerArea(15).fullTour();
  console.log("Starting 12");
  await new AnimPlayerArea(12).miniTour();
  console.log("done");
}

const actionName: string = "*Anim-player-area";
refObject.addCustomAction(actionName);
refObject.onCustomAction.add(
  (_obj: GameObject, _player: Player, action: string): void => {
    if (action === actionName) {
      runTour();
    }
  }
);

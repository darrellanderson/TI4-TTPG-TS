import { GameObject, globalEvents, world } from "@tabletop-playground/api";
import { Atop } from "ttpg-darrell";

const allObjects: Array<GameObject> = world.getAllObjects(true);
let pending: GameObject | undefined = undefined;

function onTick() {
  if (pending) {
    new Atop(pending);
    pending = undefined;
  } else {
    pending = allObjects.pop();
    if (pending) {
      console.log("Pending:", pending.getId());
    } else {
      globalEvents.onTick.remove(onTick);
    }
  }
}

globalEvents.onTick.add(onTick);

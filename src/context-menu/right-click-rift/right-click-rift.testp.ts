import { GameObject, Player, refObject } from "@tabletop-playground/api";
import { RightClickRift } from "./right-click-rift";

refObject.addCustomAction("rift yes");
refObject.addCustomAction("rift no");

refObject.onCustomAction.add(
  (obj: GameObject, _player: Player, action: string): void => {
    if (action === "rift yes") {
      RightClickRift.applyRiftResult(obj, 10, 3);
    } else if (action === "rift no") {
      RightClickRift.applyRiftResult(obj, 1, 3);
    }
  }
);

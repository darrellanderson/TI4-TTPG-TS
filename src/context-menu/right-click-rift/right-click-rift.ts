import { GameObject, globalEvents, world } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";

import { System } from "../../lib/system-lib/system/system";

export class RightClickRift implements IGlobal {
  static applyRiftResult(unitObj: GameObject, isSurvivor: boolean): void {
    //
  }

  static isRiftSystemTile(obj: GameObject): boolean {
    const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
      obj.getId()
    );
    return (
      system !== undefined && system.getAnomalies().includes("gravity-rift")
    );
  }

  init(): void {
    globalEvents.onObjectCreated.add(this._onObjectCreatedHandler);
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._onObjectCreatedHandler(obj);
    }
  }

  _onObjectCreatedHandler = (obj: GameObject): void => {
    if (RightClickRift.isRiftSystemTile(obj)) {
      //
    }
  };
}

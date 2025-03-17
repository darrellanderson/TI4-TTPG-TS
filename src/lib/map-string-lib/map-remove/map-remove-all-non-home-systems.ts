import { GameObject, ObjectType, Player } from "@tabletop-playground/api";
import { GarbageContainer } from "ttpg-darrell";
import { System } from "../../system-lib/system/system";

export class MapRemoveAllNonHomeSystems {
  removeAllNonHomeSystems(): void {
    const skipContained: boolean = true;
    const systems: Array<System> =
      TI4.systemRegistry.getAllSystemsWithObjs(skipContained);
    const player: Player | undefined = undefined;
    for (const system of systems) {
      if (!system.isHome()) {
        const obj: GameObject = system.getObj();
        obj.setObjectType(ObjectType.Regular);
        GarbageContainer.tryRecycle(obj, player);
      }
    }
  }
}

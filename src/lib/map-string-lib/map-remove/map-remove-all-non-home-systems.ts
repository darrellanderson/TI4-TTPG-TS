import { GameObject, ObjectType, Player } from "@tabletop-playground/api";
import { GarbageContainer } from "ttpg-darrell";
import { System } from "../../system-lib/system/system";

const IGNORE_TILES: Set<number> = new Set([
  18, // mecatol rex
  82, // mallice
  112,
]);

export class MapRemoveAllNonHomeSystems {
  removeAllNonHomeSystems(): void {
    const skipContained: boolean = true;
    const systems: Array<System> =
      TI4.systemRegistry.getAllSystemsWithObjs(skipContained);
    const player: Player | undefined = undefined;
    for (const system of systems) {
      const tile: number = system.getSystemTileNumber();
      if (
        !system.isHome() &&
        !IGNORE_TILES.has(tile) &&
        system.getClass() === "map"
      ) {
        const obj: GameObject = system.getObj();
        obj.setObjectType(ObjectType.Regular);
        GarbageContainer.tryRecycle(obj, player);
      }
    }
  }
}

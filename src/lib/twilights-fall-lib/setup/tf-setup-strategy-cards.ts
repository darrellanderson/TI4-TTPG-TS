import { GameObject, world } from "@tabletop-playground/api";
import { DeletedItemsContainer, GarbageContainer, NSID } from "ttpg-darrell";

export class TFSetupStrategyCards {
  setup(): void {
    this._removeOldStrategyCards();
    this._addTFStrategyCards();
  }

  _removeOldStrategyCards(): void {
    const dele: Array<GameObject> = [];
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid.startsWith("tile.strategy-card:")) {
        dele.push(obj);
      }
    }
    for (const obj of dele) {
      DeletedItemsContainer.destroyWithoutCopying(obj);
    }
  }

  _addTFStrategyCards(): void {
    const nsids: Array<string> = [
      "tile.strategy-card:twilights-fall/1-lux",
      "tile.strategy-card:twilights-fall/2-noctis",
      "tile.strategy-card:twilights-fall/3-tyrannus",
      "tile.strategy-card:twilights-fall/4-civitas",
      "tile.strategy-card:twilights-fall/5-amicus",
      "tile.strategy-card:twilights-fall/6-calamitas",
      "tile.strategy-card:twilights-fall/7-magus",
      "tile.strategy-card:twilights-fall/8-aeterna",
    ];
    for (const nsid of nsids) {
      const obj: GameObject = TI4.spawn.spawnOrThrow(nsid);
      GarbageContainer.tryRecycle(obj, undefined);
    }
  }
}

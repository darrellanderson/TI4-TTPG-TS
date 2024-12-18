import { Container, GameObject } from "@tabletop-playground/api";
import {
  DeletedItemsContainer,
  Find,
  GarbageHandler,
  NSID,
} from "ttpg-darrell";

export class RecycleUnit extends GarbageHandler {
  private readonly _find: Find = new Find();

  canRecycle(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    return nsid.startsWith("unit:");
  }

  recycle(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    const containerNsid: string = `container.${nsid}`;
    const playerSlot: number = obj.getOwningPlayerSlot();

    const skipContained: boolean = true;
    const container: Container | undefined = this._find.findContainer(
      containerNsid,
      playerSlot,
      skipContained
    );

    if (!container) {
      return false;
    }

    const type: number = container.getType();
    if (type === 1 || type === 3) {
      // Infinite container (anonymous units).
      DeletedItemsContainer.destroyWithoutCopying(obj);
      return true;
    }

    container.addObjects([obj]);
    return true;
  }
}

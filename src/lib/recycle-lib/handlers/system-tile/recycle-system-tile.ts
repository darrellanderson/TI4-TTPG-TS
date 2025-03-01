import { Container, GameObject } from "@tabletop-playground/api";
import { Find, GarbageHandler, NSID } from "ttpg-darrell";

export class RecycleSystemTile extends GarbageHandler {
  private readonly _find: Find = new Find();

  canRecycle(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    return nsid.startsWith("tile.system:");
  }

  recycle(obj: GameObject): boolean {
    const containerNsid: string = `container:base/systems`;
    const owner: number | undefined = undefined;
    const skipContained: boolean = true;
    const container: Container | undefined = this._find.findContainer(
      containerNsid,
      owner,
      skipContained
    );

    if (container) {
      container.addObjects([obj]);
      return obj.getContainer() === container; // might be full
    }

    return false;
  }
}

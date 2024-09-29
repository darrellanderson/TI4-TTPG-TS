import { Container, GameObject } from "@tabletop-playground/api";
import { Find, GarbageHandler, NSID } from "ttpg-darrell";

export class RecycleTokenControl extends GarbageHandler {
  private readonly _find: Find = new Find();

  canRecycle(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    return nsid.startsWith("token.control:");
  }

  recycle(obj: GameObject): boolean {
    const owner: number = obj.getOwningPlayerSlot();

    const containerNsid: string = `container.token.control:base/generic`;
    const skipContained: boolean = true;
    const container: Container | undefined = this._find.findContainer(
      containerNsid,
      owner,
      skipContained,
    );

    if (container) {
      container.addObjects([obj]);
      return obj.getContainer() === container; // might be full
    }

    return false;
  }
}

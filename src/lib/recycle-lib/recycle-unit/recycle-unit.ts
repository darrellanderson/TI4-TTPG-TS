import { Container, GameObject } from "@tabletop-playground/api";
import { Find, GarbageHandler, NSID } from "ttpg-darrell";

export class RecycleUnit extends GarbageHandler {
  canRecycle(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    return nsid.startsWith("unit:");
  }

  recycle(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    const containerNsid: string = `container.${nsid}`;
    const playerSlot: number = obj.getOwningPlayerSlot();

    const skipContained: boolean = true;
    const container: Container | undefined = new Find().findContainer(
      containerNsid,
      playerSlot,
      skipContained
    );

    if (!container) {
      return false;
    }

    container.addObjects([obj]);
    return true;
  }
}

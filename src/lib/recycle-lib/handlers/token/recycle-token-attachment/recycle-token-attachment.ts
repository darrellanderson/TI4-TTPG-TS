import { GameObject } from "@tabletop-playground/api";
import { Find, GarbageHandler, NSID } from "ttpg-darrell";

export class RecycleTokenAttachment extends GarbageHandler {
  private readonly _find: Find = new Find();

  constructor() {
    super();
  }

  canRecycle(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    return nsid.startsWith("token.attachment.");
  }

  recycle(obj: GameObject): boolean {
    const containerNsid: string = `container.token:base/attachment`;
    const playerSlot: number | undefined = undefined;
    const skipContained: boolean = true;
    const container = this._find.findContainer(
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

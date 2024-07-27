import { GameObject } from "@tabletop-playground/api";
import { DeletedItemsContainer, GarbageHandler, NSID } from "ttpg-darrell";

export class RecycleTokenFrontier extends GarbageHandler {
  public canRecycle(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    return nsid === "token.attachment.system:pok/frontier";
  }

  public recycle(obj: GameObject): boolean {
    DeletedItemsContainer.destroyWithoutCopying(obj);
    return true;
  }
}

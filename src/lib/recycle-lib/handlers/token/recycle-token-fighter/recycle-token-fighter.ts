import { GameObject } from "@tabletop-playground/api";
import { DeletedItemsContainer, GarbageHandler, NSID } from "ttpg-darrell";

export class RecycleTokenFighter extends GarbageHandler {
  public canRecycle(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    return nsid === "token:base/fighter-1" || nsid === "token:base/fighter-3";
  }

  public recycle(obj: GameObject): boolean {
    DeletedItemsContainer.destroyWithoutCopying(obj);
    return true;
  }
}

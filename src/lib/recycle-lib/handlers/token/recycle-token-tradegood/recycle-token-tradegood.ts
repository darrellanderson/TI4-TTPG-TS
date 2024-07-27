import { GameObject } from "@tabletop-playground/api";
import { DeletedItemsContainer, GarbageHandler, NSID } from "ttpg-darrell";

export class RecycleTokenTradegood extends GarbageHandler {
  public canRecycle(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    return (
      nsid === "token:base/tradegood-commodity-1" ||
      nsid === "token:base/tradegood-commodity-3"
    );
  }

  public recycle(obj: GameObject): boolean {
    DeletedItemsContainer.destroyWithoutCopying(obj);
    return true;
  }
}

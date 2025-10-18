import { GameObject } from "@tabletop-playground/api";
import {
  DeletedItemsContainer,
  Find,
  GarbageHandler,
  NSID,
} from "ttpg-darrell";

export class RecycleTokenControl extends GarbageHandler {
  private readonly _find: Find = new Find();

  canRecycle(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    return nsid.startsWith("token.control:");
  }

  recycle(obj: GameObject): boolean {
    DeletedItemsContainer.destroyWithoutCopying(obj);
    return true;
  }
}

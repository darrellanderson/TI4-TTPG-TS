import { world } from "@tabletop-playground/api";
import { Facing, NSID } from "ttpg-darrell";

/**
 * Ready units (flip upright if sustained).
 */
export class ReadyUnits {
  readyAllUnits(): void {
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid.startsWith("unit:") && !Facing.isFaceUp(obj)) {
        obj.flipOrUpright();
      }
    }
  }
}

import { world } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";

export class RightClickPurge implements IGlobal {
  init(): void {
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      //
    }
  }
}

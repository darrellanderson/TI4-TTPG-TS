import { world } from "@tabletop-playground/api";
import { Find, IGlobal } from "ttpg-darrell";

export class RightClickPurge implements IGlobal {
  private readonly _find: Find = new Find();

  init(): void {
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      //
    }
  }
}

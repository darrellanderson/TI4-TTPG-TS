import { refObject, Vector, world } from "@tabletop-playground/api";
import { LayoutObjectsSize } from "ttpg-darrell";

import { LayoutPlayerArea } from "./layout-player-area";

for (const obj of world.getAllObjects(true)) {
  if (obj !== refObject) {
    obj.destroy();
  }
}
const z: number = world.getTableHeight();
const pos: Vector = new Vector(0, 0, z + 3);
const yaw: number = 0;

const layoutPlayerArea: LayoutPlayerArea = new LayoutPlayerArea(1);
layoutPlayerArea.getLayout().doLayoutAtPoint(pos, yaw);

const size: LayoutObjectsSize = layoutPlayerArea.getLayout().calculateSize();
console.log("size: " + size.w + " x " + size.h);

import { refObject, Vector, world } from "@tabletop-playground/api";
import { LayoutObjectsSize } from "ttpg-darrell";

import { LayoutPlayerAreas } from "./layout-player-areas";
import { SetupPlayerSlotColors } from "../../setup-player-slot-colors/setup-player-slot-colors";

new SetupPlayerSlotColors().setup();

for (const obj of world.getAllObjects(true)) {
  if (obj !== refObject) {
    obj.destroy();
  }
}
for (const line of world.getDrawingLines()) {
  world.removeDrawingLineObject(line);
}

const z: number = world.getTableHeight();
const pos: Vector = new Vector(0, 0, z + 3);
const yaw: number = 0;

const layoutPlayerAreas: LayoutPlayerAreas = new LayoutPlayerAreas(6);
layoutPlayerAreas.getLayout().doLayoutAtPoint(pos, yaw);

const size: LayoutObjectsSize = layoutPlayerAreas.getLayout().calculateSize();
console.log("size: " + size.w + " x " + size.h);
